const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


const users = JSON.parse(localStorage.getItem('favoriteUsers')) || []
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
            <button class="btn btn-danger btn-remove-favorite" data-id ="${item.id}">X</button>
          </div>
        </div>
      </div>
    </div>
    `    
  })
  dataPanel.innerHTML = rawHTML
}

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

//移除我的最愛
function removeFromFavorite(id) {
  const userIndex = users.findIndex((user) => user.id === id)
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.card-img-top')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderUserList(users)

