const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

const USERS_PER_PAGE = 18
const users = []
let filteredUsers = []



// 列出User名單
function renderUserList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-2">
      <div class="mb-3">
        <div class="card">
          <img class="card-img-top" src="${item.avatar}" alt="avatar" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
          <div class="card-body">
            <h6 class="card-title">${item.name}</h6>
          </div>
          <div class="row mx-0">
              <button class="btn btn-info btn-add-favorite" data-id ="${item.id}">+</button>
          </div>
        </div>
      </div>
    </div>
    `    
  })
  dataPanel.innerHTML = rawHTML
}

// 增加分頁功能
function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML

}

//設置分頁監聽
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})

// 設置監聽器
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.card-img-top')) {
    showUserModal(event.target.dataset.id)
  }
})

//user詳細資料
function showUserModal(id){
  const title = document.querySelector('#user-title')
  const avatar = document.querySelector('#user-avatar')
  const gender = document.querySelector('#user-gender')
  const age = document.querySelector('#user-age')
  const birthday = document.querySelector('#user-birthday')
  const region = document.querySelector('#user-region')
  const email = document.querySelector('#user-email')
  
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    title.innerText = data.name + ' ' + data.surname
    gender.innerText = 'Gender:' + data.gender
    age.innerText = 'Age:' + data.age
    birthday.innerText = 'Birthday:' + data.birthday
    region.innerText = 'Region:' + data.region
    email.innerText = 'Email:' + data.email
    avatar.innerHTML = `<img src="${data.avatar}" alt="avatar" class="avatar">`
  })
}

//加入我的最愛
dataPanel.addEventListener('click', function plusClicked(event) {
  if (event.target.matches(".btn")) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find((user) => user.id === id)
  
  if (list.some((user) => user.id === id)) {
    return alert('此人已在你的朋友名單裡')
  }



  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}



//增加搜尋功能
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )

  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的人`)
  }

  renderPaginator(filteredUsers.length)
  renderUserList(getUsersByPage(1))
})



// 請求API資料
axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results)
  renderPaginator(users.length)
  renderUserList(getUsersByPage(1))
})
  .catch((err) => console.log(err))
