const url ='http://localhost:5000/';


export async function getAllUsersYears(){
    let data=await fetch(url + 'user/years');
    let years =await data.json();
    
    return years;
}


export async function getAllUsersYearsByMonth(year) {
    let data = await fetch(url + `user/count/${year}`);
    let users = await data.json();
    
    return users;
}


export async function getAllabcoYears(){
    console.log("url: ",url )
    let data=await fetch(url + 'abCo/years');
    let years =await data.json();
    return years;
}

export async function getAllabcoByMonth(year) {
    
    let data = await fetch(url + `abCo/active/${year}`);
    let abocs = await data.json();
    
    return abocs;
}


export async function getAlloffreYears(){
    let data=await fetch(url + 'Offre/offre/years');
    let years =await data.json();
    return years;
}

export async function getAllOffreByMonth(year) {
    
    let data = await fetch(url + `Offre/offre/count/${year}`);
    let offres = await data.json();
    
    return offres;
}


export async function getAlloffreInfYears(){
    let data=await fetch(url + 'Offre/offreClient/years');
    let years =await data.json();
    return years;
}

export async function getAllOffreInfByMonth(year) {
    
    let data = await fetch(url + `Offre/offreClient/count/${year}`);
    let offresInf = await data.json();
    
    return offresInf;
}


export async function getAllTransactionYears(){
    let data=await fetch(url + 'transaction/tran/years');
    let years =await data.json();
    return years;
}


export async function getAllTransactionByMonth(year) {
    
    let data = await fetch(url + `transaction/tran/count/${year}`);
    let TransactionMonth = await data.json();
    
    return TransactionMonth;
}



export async function getAllSignalementYears(){
    let data=await fetch(url + 'signalement/Sig/years');
    let years =await data.json();
    return years;
}


export async function getAllSignalementByMonth(year) {
    
    let data = await fetch(url + `signalement/Sig/count/${year}`);
    let TransactionMonth = await data.json();
    
    return TransactionMonth;
}


export async function getAllCommercantYears(commercant_id){
    let data=await fetch(url + `Offre/nbrInfPerCommercantYears/${commercant_id}`);
    let years =await data.json();
    return years;
}

export async function fetchNbrInfPerCommercant(commercantId, year){
    try { 
      const response = await fetch(url +'Offre/nbrInfPerCommercant/count/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: commercantId,
          year: year
        })
      });
  
      if (!response.ok) {
        throw new Error('Erreur de requête');
      }
  
      const comInf = await response.json();
      return comInf;

    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
};   



export async function getAllCommercant() {
    
    let data = await fetch(url + 'abCo/usernames');
    let TransactionMonth = await data.json();
    
    return TransactionMonth;
}

export async function getTotalUsers() {
    
    let data = await fetch(url + 'user/count');
    let toUsers = await data.json();
    
    return toUsers;
}

export async function getTotalabco() {
    
    let data = await fetch(url + 'abCo/countTotal');
    let totalabco = await data.json();
    
    return totalabco;
}


export async function getTotalInfOffres() {
    
    let data = await fetch(url + 'Offre/count-infOffres');
    let TotalInfOffres = await data.json();
    
    return TotalInfOffres;
}


export async function getTotalOffres() {
    
    let data = await fetch(url + 'Offre/count-active');
    let TotaOffres = await data.json();
    
    return TotaOffres;
}


export async function getTotalTranaCommission() {
    
    let data = await fetch(url + 'transaction/total-commission');
    let TotaTransactionComm = await data.json();
    
    return TotaTransactionComm;
}


export async function getTotalSignalement() {
    
    let data = await fetch(url + 'signalement/count');
    let TotaTSignalement = await data.json();
    
    return TotaTSignalement;
}


export async function getAIDE() {
    
    let data = await fetch(url + 'aide/help');
    let aide = await data.json();
    
    return aide;
}


export async function updateAIDE(aide){
    try { 
      const response = await fetch(url +'aide/help/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: aide.email,
          telephone: aide.telephone,
          facebook_url: aide.facebook_url,
          instagram_url: aide.instagram_url,
          twitter_url: aide.twitter_url,
        })
      });
  
      if (!response.ok) {
        throw new Error('Erreur de requête');
      }
  
      const comInf = await response.json();
      return comInf;

    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
};


export async function getAllUsers() {
    
  let data = await fetch(url + 'user/allUsers');
  let users = await data.json();
  return users;
}


export async function SRchByUsername(username){
  try { 
    const response = await fetch(url +'user/SrchByUn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernane: username
      })
    });

    if (!response.ok) {
      throw new Error('Erreur de requête');
    }

    const comInf = await response.json();
    return comInf;

  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};

//

export async function deleteUserbyUsername(username){
  try { 

    const response = await fetch(url +`user/delete/${username}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur de requête');
    }

    const comInf = await response.json();
    return comInf;

  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};

export async function updateUser(username,updatedata){
  
  
  try { 
    const response = await fetch(url +'user/profileUpdate', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        ...updatedata
      })
    });

    if (!response.ok) {
      throw new Error('Erreur de requête');
    }

    const comInf = await response.json();
    return comInf;

  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};


export async function getAdminInformation() {
    
  let response = await fetch(url + 'user/profileAdmin');
  let adminInfo = await response.json();
  return adminInfo;
}

export async function getAllQuestionReponse() {
    
  let response = await fetch(url + 'question/getAllQuestionReponse');
  let questionReponse = await response.json();
  return questionReponse;

}

export async function createAnswer(adminId, questionId, content) {

  console.log("adminId: ",adminId);
  console.log("questionId: ",questionId);
  console.log("content: ",content);


  try {
    const response = await fetch(url +`reponse/reponse/${adminId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId,
        content
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création de la réponse:', error);
    throw error;
  }
}; 


export async function deleteById(question_id) {

  console.log("question_id: ",question_id);
  try {
    const response = await fetch(url +'question/deleteByQuestionId', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_question:question_id
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la suppression de la question:', error);
    throw error;
  }
}; 