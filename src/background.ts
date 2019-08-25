declare let chrome

const io = require('socket.io-client')

const ScalableCuckooFilter = require('cuckoo-filter').ScalableCuckooFilter
let cuckoo2 = new ScalableCuckooFilter(2000, 4, 2, 2)

cuckoo2.add("www.amazon.com")
cuckoo2.add("www.netflix.com")
cuckoo2.add("www.coinbase.com")


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("got message", request)
    if (cuckoo2.contains(request.location)) {
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
