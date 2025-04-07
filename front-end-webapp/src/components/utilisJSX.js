const utilisJSX = () => {
    return (
        <div>
            <div id="function1">
                {
                    /*
                        condition ? true : false (autre check)
                        {condition1 ? 
                            (résultat si condition1 est vraie) 
                        : condition2 ? 
                            (résultat si condition2 est vraie) 
                        : 
                            (résultat si les deux conditions sont fausses)
                        }
                    */
                }
            </div> 
            
            <div id="function2">
                {
                    /*
                        ...(warningType === 'temporaryBlock' && { days: temporaryBlockDays })

                        ****
                            ceci signifie si le type d'avertissement est 'temporaryBlock',
                            alors on ajoute une propriété 'days' avec la valeur de temporaryBlockDays;
                            sino, rien n'est ajouté au dataContnt
                        ***
                    */
                }
            </div>
        </div>



    );
}

