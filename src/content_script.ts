const USER_KEYWORDS = ['email', 'user', 'username']
const PASSWORD_KEYWORDS = ['password', 'pass']
const ATTRIBUTE_USER_KEYWORDS = ['username', 'email']
const ATTRIBUTE_CURRENT_PASSWORD_KEYWORDS = ['current-password']

const findInputByName = function (nameKeywords) {
    for (let userKeyword of nameKeywords) {
        for (let element of Array.from(document.getElementsByName(userKeyword))) {
            if (element.tagName && element.tagName.toLowerCase() == 'input') {
                return element
            }
        }
    }
}

const findInputByAutocompleteAttribute = function (attributeKeywords) {
    for (let attributeKeyword of attributeKeywords) {
        for (let element of Array.from(document.getElementsByTagName('input'))) {
            if (element.getAttribute('autocomplete') && element.getAttribute('autocomplete').toLowerCase() == attributeKeyword) {
                return element
            }
        }
    }
}

const findCurrentPasswordField = function () {
    let passwordElement = findInputByAutocompleteAttribute(ATTRIBUTE_CURRENT_PASSWORD_KEYWORDS)
    if (passwordElement === undefined) {
        passwordElement = findInputByName(PASSWORD_KEYWORDS) as HTMLInputElement
    }
    return passwordElement
}

const findUsernameField = function () {
    let usernameElement = findInputByAutocompleteAttribute(ATTRIBUTE_USER_KEYWORDS)

    if (usernameElement === undefined) {
        usernameElement = findInputByName(USER_KEYWORDS) as HTMLInputElement
    }

    return usernameElement
}

const uuid = function () {
    const buf = new Uint32Array(4)
    window.crypto.getRandomValues(buf)
    let idx = -1
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        idx++
        const r = (buf[idx >> 3] >> ((idx % 8) * 4)) & 15
        const v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

setTimeout(() => {
    if (findCurrentPasswordField() !== undefined) {
        chrome.runtime.sendMessage({location: location.hostname, uuid:uuid()}, function (response) {
            console.log(response)
            if (findUsernameField() !== undefined && response.username !== undefined) {
                findUsernameField().value = response.username
            }

            if (findCurrentPasswordField() !== undefined && response.password !== undefined) {
                findCurrentPasswordField().value = response.password
            }
        })
    }
}, 500)




