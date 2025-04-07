const RoleEnum = {
    ADMIN: 'ADMIN',
    CLIENT: 'CLIENT',
    COMMERCANT: 'COMMERCANT'
  };
  
  const TransactionStatusEnum = {
    EN_ATTENTE: 'EN_ATTENTE',
    VALIDEE: 'VALIDEE',
    REFUSEE: 'REFUSEE',
    ANNULEE: 'ANNULEE'
  };
  
  const PaiementTypeEnum = {
    CARTE: 'CARTE',
    VIREMENT: 'VIREMENT',
    PAYPAL: 'PAYPAL'
  };
  
  const PaiementStatusEnum = {
    EN_ATTENTE: 'EN_ATTENTE',
    COMPLETE: 'COMPLETE',
    ECHOUE: 'ECHOUE',
    REMBOURSE: 'REMBOURSE'
  };
  
  const ConversionStatusEnum = {
    EN_ATTENTE: 'EN_ATTENTE',
    VALIDEE: 'VALIDEE',
    REFUSEE: 'REFUSEE'
  };
  
  const GroupeRoleEnum = {
    ADMIN: 'ADMIN',
    MEMBRE: 'MEMBRE',
    MODERATEUR: 'MODERATEUR'
  };
  
  const AbonnementStatusEnum={
    ACTIF: 'ACTIF',
    EXPIRE: 'EXPIRE',
    RESILIE: 'RESILIE',
    EN_ATTENTE: 'EN_ATTENTE'
};
  
  const FacturationStatusEnum = {
    PAYEE: 'PAYEE',
    EN_ATTENTE: 'EN_ATTENTE',
    ECHOUEE: 'ECHOUEE'
  };

  const QuestionStatusEnum = {
    EN_ATTENTE: 'EN_ATTENTE',
    CLOTURE: 'VALIDEE',
  };

  const SignalementEnum={
    temporaryBlock: 'temporaryBlock',
    permanentBlock: 'permanentBlock',
    firstWarning: 'firstWarning',
  }

  module.exports = {
    RoleEnum,
    TransactionStatusEnum,
    PaiementTypeEnum,
    PaiementStatusEnum,
    ConversionStatusEnum,
    GroupeRoleEnum,
    AbonnementStatusEnum,
    FacturationStatusEnum,
    QuestionStatusEnum,
    SignalementEnum
  };