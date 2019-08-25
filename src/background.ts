declare let chrome

const io = require('socket.io-client')

const ScalableCuckooFilter = require('cuckoo-filter').ScalableCuckooFilter
let cuckoo = new ScalableCuckooFilter(2000, 4, 2, 2)

cuckoo.add("microspot.ch")
cuckoo.add("netflix.com")

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("got message", request)
    if (cuckoo.contains(request.location)) {
        const socket = io.connect("https://you-backend.herokuapp.com/")
        request.address = "0x7aC40f4302895009033186F7532442c17Bea1e36"
        socket.once('login_response_' + request.uuid, data => {
            console.log('got data!', data)
            sendResponse(data)
            chrome.notifications.clear(request.uuid)
        })

        socket.emit('login_request', request)
        const notificationOptions = {
            type: "basic",
            iconUrl: "./icons/you-simple-logo128px.png",
            title: "Login Request",
            message: "Check your secure device",
        }
        chrome.notifications.create(request.uuid, notificationOptions)
    }
    return true
})



