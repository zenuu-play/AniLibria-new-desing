function search(){
    var resultOut = document.getElementById('navSearchResult')
    resultOut.innerHTML='<a class="dropdown-item" href="#">Введите название для поиска</a>'
    if(document.getElementById('navSearch').value != ""){
        $.get({
            url: 'https://api.anilibria.tv/v2/searchTitles',
            data: `search=${document.getElementById('navSearch').value}&limit=10&filter=names,status,id,code`,
            success: function(response){
                resultOut.innerHTML=''
                var resultItem, release_name;
                
                response.forEach(element => {
                    status = null
                    if(element.status.string == "В работе"){
                        status = 'info'
                    }else if(element.status.string == "Завершен"){
                        status = 'success'
                    }
                    else{
                        status = 'warning'
                    }
                    resultItem = document.createElement('li')
                    resultItem.innerHTML=`<a class="dropdown-item" href="/release/${element.id}"><span class="d-inline-block bg-${status} rounded-circle" style="width: .5em; height: .5em;"></span> ${element.names.ru}</a>`
                    resultOut.appendChild(resultItem)
                });
                if(!response[0]){
                    resultItem = document.createElement('li')
                    resultItem.innerHTML=`<a class="dropdown-item" href="#">Нечего не найдено :/</a>`
                    resultOut.appendChild(resultItem)
                }


            } 
        })

    }
}

function loadRelease(rid, code){
    
    $.get({
        url: 'https://api.anilibria.tv/v2/GET%20/v2/getTitle',
        data: 'id='+rid,
        success: function(response){
            document.title = response.names.ru + " / " + response.names.en
            document.getElementById('releasePoster').setAttribute('src' , `https://www.anilibria.tv/${response.poster.url}`)
            document.getElementById('releaseTitleEn').innerHTML=response.names.en

            if(response.status.string == 'В работе'){
                document.getElementById('releaseTitle').innerHTML=`${response.names.ru} <span class="badge bg-success">Выходит</span>`
            }else{
                document.getElementById('releaseTitle').innerHTML= response.names.ru
            }

            document.getElementById('season').innerHTML=`Сезон: <span class="text-dark">${response.season.string} ${response.season.year}</span>`
            document.getElementById('type').innerHTML=`Тип: <span class="text-dark">${response.type.string} (${response.type.full_string})</span>`
            document.getElementById('genres').innerHTML=`Жанры: <span class="text-dark">${response.genres}</span>`
            document.getElementById('voice').innerHTML=`Озвучка: <span class="text-dark">${response.team.voice}</span>`
            document.getElementById('timings').innerHTML=`Тайминги: <span class="text-dark">${response.team.timing}</span>`
            document.getElementById('subs').innerHTML=`Субтитры: <span class="text-dark">${response.team.translator}</span>`

            document.getElementById('disc').innerHTML=`<span class="text-dark">${response.description}</span>`

            if(response.names.alternative){
                document.getElementById('releaseTitleAlt').innerHTML=response.names.alternative
            }

            var playList = response.player.playlist;

            var i = 1
            var b = response.player.series.last
            var list = new Array()

            for(i; i <= b; i++){
                list[i] = { "title":`Серия: ${response.player.playlist[i].serie}`, "file":`https://${response.player.host}${response.player.playlist[i].hls.hd}`  }
            }

            list[0] = {};

            var player = new Playerjs({id:"player", 
            file: list});

            console.log(list)

            console.log(response)
        }
    })
}

function randomTitle(){
    $.get({
        url: 'https://api.anilibria.tv/v2/getRandomTitle',
        data: 'filter=code,names,id',
        success: function(response){
            window.location.pathname="/release/"+ response.id
        }
    })
}

