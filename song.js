$(function () {

    let id = parseInt(location.search.match(/\bid=([^&]*)/)[1], 10)

    $.get('./songs.json').then(function (response) {
        let songs = response
        let song = songs.filter(s => s.id === id)[0]
        let { url, name, img, back, lyric } = song

        initAudio(url)
        initText(name, lyric)
        initPicture(img)
        setBackground(back)
    })

    function initPicture(img){
        //console.log(img)
        
        let $picture = $(`<img class="picture" src=${img} alt="picture">`)
             $picture.appendTo('.disc-container')
    }
    
    function setBackground(back){
        console.log(back)
          let $discWrapper = $('#disc-wrapper')

        $backgroundImg = $('#disc-wrapper').css('background','transparent url(' + back + ') no-repeat center')
                        .css('background-size','cover')
    }

    function initText(name, lyric) {
        $('.m-song-info > h2').text(name)
        initWords(lyric)
    }

    function initAudio(url) {
        let audio = document.createElement('audio')
        audio.src = url

        audio.oncanplay = function () {
            audio.play()
            $('.disc-container').addClass('playing')
            $('.pointer').addClass('change2')
            $('.pointer').removeClass('change1')
            $('.disc-container').css('animation-play-state','running')
        }
        audio.addEventListener('ended', function () {
            audio.play()
        })
        $('.icon-pause').on('click', function () {
            audio.pause()
            $('.disc-container').removeClass('playing')
            $('.pointer').addClass('change1')
            $('.pointer').removeClass('change2')
            $('.disc-container').css('animation-play-state','paused')
        })
        $('.icon-play').on('click', function () {
            audio.play()
            $('.disc-container').addClass('playing')
            $('.pointer').addClass('change2')
            $('.pointer').removeClass('change1')
            $('.disc-container').css('animation-play-state','running')
        })
        //同步歌词
        setInterval(() => {
            let seconds = audio.currentTime
            let minutes = ~~(seconds / 60)
            let left = seconds - minutes * 60
            let time = `${double(minutes)}:${double(left)}`
            let $lines = $('.lyric-scroll> p')
            let $whichLine
            for (let i = 0; i < $lines.length; i++) {
                let currentLineTime = $lines.eq(i).attr('data-time')
                let nextLineTime = $lines.eq(i + 1).attr('data-time')
                if ($lines.eq(i + 1).length !== 0 && currentLineTime < time && nextLineTime > time) {
                    $whichLine = $lines.eq(i)
                    break
                }
            }
            if ($whichLine) {
                $whichLine.addClass('active').prev().removeClass('active')
                let top = $whichLine.offset().top
                let linesTop = $('.lyric-scroll').offset().top
                let delta = top - linesTop - $('.lyric').height() / 3
                
                $('.lyric-scroll').css('transform', `translateY(-${delta}px)`)
            }
        }, 300)
    }



    function initWords(lyric) {

            let array = lyric.split('\n')
            let regex = /^\[(.+)\](.*)$/

            array = array.map(function (string) {
                let matches = regex.exec(string)
                if (matches) {
                    console.log(matches[1])
                    console.log(matches[2])
                    return { time: matches[1], words: matches[2] }
                }
            })

            let $lyric = $('.lyric')
            array.map(function (object) {
                if (!object) { return }
                let $p = $('<p/>')
                $p.attr('data-time', object.time).text(object.words)
                $p.appendTo($lyric.children('.lyric-scroll'))
            })
        
    }
    

    function double(number) {
        return number >= 10 ? number + '' : '0' + number
    }

})