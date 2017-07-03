console.log(888)
$(function () {
    //index.html
    setTimeout(function () {
        $.get('./songs.json').then(function (response) {
            let items = response
            items.forEach(i => {
                let $li = $(
                    `
					<li>
                   <a href="./song.html?id=${i.id}">
                        <h3>${i.name}</h3>
                        <p>
                        <img src="./images/sq.png" alt="">
                        <span>演唱者-${i.singer}</span>                       
                        </p>
                    </a>
                    <a href="./song.html?id=${i.id}">
                        <svg class="icon-link-play" aria-hidden="true">
                            <use xlink:href="#icon-link-play"></use>
                        </svg>
                    </a>

                </li>
					`
                )
                //console.log($li)
                $('.latestMusic').append($li)

            })
            $('#lastestMusicLoading').remove()
        })
    }, 1000)

    //tabChange  
    $('.m-homenav').on('click', 'ol.tabItems>li', function (e) {
        let $li = $(e.currentTarget).addClass('active')
        $li.siblings().removeClass('active')
        let index = $li.index()
        $li.trigger('tabChange', index)
        $('#container > li').eq(index).addClass('active')
            .siblings().removeClass('active')
    })

    //hotMusic
    $('.m-homenav').on('tabChange', function (e, index) {
        //console.log(e, index)
        let $li = $('#container > li').eq(index)
        if ($li.attr('data-downloaded') === 'yes') { return }

        if (index === 1) {
            $.get('./page2.json').then((response) => {
                //console.log(1)
                //console.log(response)
                let items = response
                items.forEach(i => {
                    let $li2 = $(
                        `
					<li>
                        <a class="hrefSong" href="./song.html?id=${i.id}">
                            <div class="songId">${i.number}</div>
                            <div class=songerInfo>
                                    <h3>${i.name}</h3>
                                    <p>
                                    <img src="./images/sq.png" alt="">
                                    <span>演唱者-${i.singer}</span>
                                    </p>                       
                            </div>                      
                            <svg class="icon-link-play" aria-hidden="true">
                                <use xlink:href="#icon-link-play"></use>
                            </svg>                           
                        </a>
                </li>
					`
                    )
                    //console.log($li)
                    $('.hotcontent > ol').append($li2)

                })

                $li.attr('data-downloaded', 'yes')
                $('#tab2Loading').remove()
            })
        } else if (index === 2) {
            return
            $.get('./page3.json').then((response) => {
                //console.log(response)
                $li.text(response.content)
                $li.attr('data-downloaded', 'yes')
                //$('#tab3Loading').remove()
            })
        }
    })

    //搜索页面
    let timer = undefined
    $('input#searchSong').on('input', function (e) {
        let $input = $(e.currentTarget)
        let value = $input.val().trim()
        if (value === '') { return }

        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(function () {
            search(value).then((result) => {
                timer = undefined
                if (result.length !== 0) {
                    $('#output').empty()
                    let $ul = $('<ul></ul>')
                    result.forEach((item) => {
                        let $li = $(`
                        <li><a href="./song.html?id=${item.id}">${item.name}</a></li>
                        `)
                        $li.appendTo($ul)
                    })
                    $('#output').append($ul)
                } else {
                    $('#output').html('没有结果')
                }
            })
        }, 300)
    })

    function search(keyword) {
        console.log('搜索' + keyword)
        return new Promise((resolve, reject) => {
            var database = [
                { "id": 1, "name": "别找我麻烦", },
                { "id": 2, "name": "喜欢你", },
                { "id": 3, "name": "I'm Yours", },
                { "id": 4, "name": "A Thousand Year", },
                { "id": 5, "name": "Love In December", },
                { "id": 6, "name": "You Are Beautiful", },
                { "id": 7, "name": "旅途", },
                { "id": 8, "name": "稻香", },
                { "id": 9, "name": "夜曲", },
                { "id": 10, "name": "不要再孤单", }
            ]
            let result = database.filter(function (item) {
                return item.name.indexOf(keyword) >= 0
            })
            setTimeout(function () {
                console.log('搜到' + keyword + '的结果')
                resolve(result)
            }, (Math.random() * 200 + 1000))
        })
    }
    window.search = search
})