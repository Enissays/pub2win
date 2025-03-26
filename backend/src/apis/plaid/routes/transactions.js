const express = require("express");
const { getLoggedInUserId } = require("../utils");
const db = require("../db");
const { plaidClient } = require("../plaid");
const { setTimeout } = require("timers/promises");
const { SimpleTransaction } = require("../simpleTransactionObject");

const router = express.Router();

/**
 * This will ask our server to make a transactions sync call
 * against all the items it has for a particular user. This is one way
 * you can keep your transaction data up to date, but it's preferable
 * to just fetch data for a single item in response to a webhook.
 */
router.post("/sync", async (req, res, next) => {
  try {
    const userId = getLoggedInUserId(req);
    const items = await db.getItemsIdsForUser(userId);
    console.log(userId);
    for (let item of items) {
      console.log(item);
      await syncTransactions(item.id);
      await setTimeout(1000);
    }
    res.json({ status: "success" });
  } catch (error) {
    console.log(`Running into an error!`);
    next(error);
  }
});

/**
 * Given an item ID, this will fetch all transactions for all accounts
 * associated with this item using the sync API. We can call this manually
 * using the /sync endpoint above, or we can call this in response
 * to a webhook
 */
const syncTransactions = async function (itemId) {
  const summary = { added: 0, removed: 0, modified: 0 };
  const {access_token: accessToken} = await db.getItemInfo(itemId);
  const allData = await fetchNewSyncData(accessToken);
  return summary;
};

const fetchNewSyncData = async function (accessToken) {
  let keepGoing = false;
  const allData = { added: [], removed: [], modified: [], nextCursor: null };
  do {
    const results = await plaidClient.transactionsSync({
      access_token: accessToken,
      options: {
        include_personal_finance_category: true,
      }
    });
    const newData = results.data;
    allData.added = allData.added.concat(newData.added);
    allData.removed = allData.removed.concat(newData.removed);
    allData.modified = allData.modified.concat(newData.modified);
    allData.nextCursor = newData.next_cursor;
    keepGoing = newData.has_more;
    console.log(
      `Added: ${newData.added.length}, Removed: ${newData.removed.length}, Modified: ${newData.modified.length}`
    )
  } while (keepGoing);
}

/**
 * Fetch all the transactions for a particular user (up to a limit)
 * This is really just a simple database query, since our server has already
 * fetched these items using the syncTransactions call above
 *
 */
router.get("/list", async (req, res, next) => {
  try {
    res.json({ todo: "Implement this method" });
  } catch (error) {
    console.log(`Running into an error!`);
    next(error);
  }
});

module.exports = { router, syncTransactions };
