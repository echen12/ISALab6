import * as constants from './constants.js';

const searchButton = document.getElementById(constants.SEARCH_BUTTON_ID);
const word = document.getElementById(constants.WORD_INPUT_ID);
const errorCode = document.getElementById(constants.ERROR_CODE_ID);
const errorMessage = document.getElementById(constants.ERROR_MESSAGE_ID);

function searchForWord(e) {
    e.preventDefault();
    const wordValue = word.value;

    if (wordValue === "") {
        errorMessage.textContent = constants.ERROR_MUST_ENTER_WORD;
        return;
    }

    fetch(constants.GET_WORD_API + wordValue, { method: "GET" })
        .then((response) => {
            if (response.ok) {
                errorCode.textContent = response.status;
            }
            response.json().then((data) => {
                errorMessage.textContent = constants.ERROR_DEFINITION_PREFIX + data.definition;
            });
        });
}

searchButton.addEventListener("click", searchForWord);