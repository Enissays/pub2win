const { IgApiClient } = require("instagram-private-api");

const ig = new IgApiClient();
require("dotenv").config(); 


async function checkPrivateMessages() {
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.simulate.preLoginFlow();
    console.log(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    //process.nextTick(async () => await ig.simulate.postLoginFlow());

    const inboxFeed = ig.feed.directInbox();
    const threads = await inboxFeed.items();
    for (const thread of threads) {
        console.log(`Thread with ${thread.users.map(user => user.username).join(', ')}`);
        for (const item of thread.items) {
            console.log(item);
        }
    }
}

function isMentioned(jsonData, otherUserId) {
    const isMentionShare = jsonData.reel_share?.type === "mention";

    const isViewerMentioned = jsonData.reel_share?.media?.is_viewer_mentioned === true;

    const isOtherUserMentioned = jsonData.reel_share?.mentioned_user_id === otherUserId;

    return {
        viewerMentioned: isMentionShare && isViewerMentioned,
        otherUserMentioned: isMentionShare && isOtherUserMentioned
    };
}


(async () => {
    await checkPrivateMessages();
})();