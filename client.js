import * as constants from './constants.js';

const submitButton = document.getElementById(constants.SUBMIT_BUTTON_ID);

function addLanguageToServer(e) {
    e.preventDefault();
    const wordLanguage = document.getElementById(constants.WORD_LANGUAGE_SELECT_ID).value;
    const definitionLanguage = document.getElementById(constants.DEFINITION_LANGUAGE_SELECT_ID).value;
    const word = document.getElementById(constants.WORD_INPUT_ID).value;
    const definition = document.getElementById(constants.DEFINITION_INPUT_ID).value;

    const decodedWordLanguage = decodeURIComponent(wordLanguage);
    const decodedDefLanguage = decodeURIComponent(definitionLanguage);
    const decodedWord = decodeURIComponent(word);
    const decodedDef = decodeURIComponent(definition);

    const errorCode = document.getElementById(constants.ERROR_CODE_ID);
    const errorMessage = document.getElementById(constants.ERROR_MESSAGE_ID);

    // send get to check if word already exists
    fetch(constants.GET_WORD_API + decodedWord, { method: 'GET' })
        .then(response => {
            if (response.ok) {
                // Word exists, prompt the user to choose action
                const action = window.prompt(constants.PROMPT_UPDATE_DELETE);

                if (action === "update") {
                    // User wants to update, send a PATCH request
                    const updateData = {
                        "word": decodedWord,
                        "wordDefinition": decodedDef,
                        "wordLanguage": decodedWordLanguage,
                        "definitionLanguage": decodedDefLanguage
                    };
                    const updateOptions = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updateData),
                    };

                    fetch(constants.PATCH_LANG_API + decodedWord, updateOptions)
                        .then(response => {
                            errorCode.textContent = response.status;
                            response.json().then(data => {
                                errorMessage.textContent = data.message;
                            });
                        })
                        .catch(error => {
                            console.error(constants.ERROR_UPDATE_DEFINITION, error);
                        });
                } else if (action === "delete") {
                    // User wants to delete, send a DELETE request
                    const deleteOptions = {
                        method: 'DELETE',
                    }
                    fetch(constants.DELETE_LANG_API + decodedWord, deleteOptions)
                        .then(response => {
                            errorCode.textContent = response.status;
                            response.json().then(data => {
                                errorMessage.textContent = constants.ERROR_DEFINITION_PREFIX + data.message;
                            })
                        })
                        .catch(error => {
                            console.error(constants.ERROR_DELETE_WORD, error);
                        });
                } else {
                    // Invalid action or canceled, do nothing
                    errorCode.textContent = constants.INVALID_ACTION_CANCELED;
                    errorMessage.textContent = "";
                }
            } else {
                // Word doesn't exist, send a POST request to create it
                const postData = {
                    "word": decodedWord,
                    "wordDefinition": decodedDef,
                    "wordLanguage": decodedWordLanguage,
                    "definitionLanguage": decodedDefLanguage
                };

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                };

                fetch(constants.POST_LANG_API, requestOptions)
                    .then(response => {
                        errorCode.textContent = response.status;
                        response.json().then(data => {
                            errorMessage.textContent = data.message;
                        });
                    })
                    .catch(error => {
                        console.error(constants.ERROR_UPDATE_DEFINITION, error);
                    });
            }
        })
        .catch(error => {
            console.error('Error checking if the word exists:', error);
        });
}

function getDataFromAPI() {
    const apiUrl = constants.GET_ALL_LANGS_API;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const wordLanguageSelect = document.getElementById(constants.WORD_LANGUAGE_SELECT_ID);
            const definitionLanguageSelect = document.getElementById(constants.DEFINITION_LANGUAGE_SELECT_ID);
            data.languages.forEach(language => {
                const wordOption = document.createElement('option');
                const defOption = document.createElement('option');
                wordOption.value = language.language_name;
                wordOption.textContent = language.language_name;
                wordLanguageSelect.appendChild(wordOption);
                defOption.value = language.language_name;
                defOption.textContent = language.language_name;
                definitionLanguageSelect.appendChild(defOption);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

submitButton.addEventListener('click', addLanguageToServer);

getDataFromAPI();