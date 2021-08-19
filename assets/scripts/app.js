function search(){
    var resultOut = document.getElementById('navSearchResult')
    resultOut.innerHTML='<a class="dropdown-item" href="#">Введите название для поиска</a>'
    if(document.getElementById('navSearch').value != ""){
        $.get({
            url: 'https://api.anilibria.tv/v2/searchTitles',
            data: `search=${document.getElementById('navSearch').value}&limit=10&filter=names,status,id`,
            success: function(response){
                resultOut.innerHTML=''
                var resultItem
                
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
                    resultItem.innerHTML=`<a class="dropdown-item" href="#"><span class="d-inline-block bg-${status} rounded-circle" style="width: .5em; height: .5em;"></span> ${element.names.ru}</a>`
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

