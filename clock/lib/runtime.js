(function () {
    const hoursView = document.querySelector('#hours')
    const minutesView = document.querySelector('#minutes')
    const secondsView = document.querySelector('#seconds')
    const dateView = document.querySelector('#date')

    console.log(dateView)

    window.setInterval(function () {
        const date = new Date();
        const hours = `${date.getHours()}`.padStart(2, '0')
        const minutes = `${date.getMinutes()}`.padStart(2, '0')
        const seconds = `${date.getSeconds()}`.padStart(2, '0')
        hoursView.innerText = hours
        minutesView.innerText = minutes
        secondsView.innerText = seconds

        const dayName = date.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })

        dateView.innerText = dayName

    }, 250);
})()
