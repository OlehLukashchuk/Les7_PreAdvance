// Усі доступи DOM елементів.
let filmContainer = document.querySelector('.films_container');
let movieName = document.querySelector('.filmName');
let search = document.getElementById('searchs');
let modal = document.querySelector('.modalDiv');
let wrapper = document.querySelector('.wrapper');
let rightContent = document.querySelector('.content__right')
let modalImg = document.getElementById('modalImg');
let modalTitle = document.getElementById('modalTitle');
let smallInfo = document.getElementById('smallInfo');
let plot = document.getElementById('plot');
let writtenBy = document.getElementById('writtenBy');
let directedBy = document.getElementById('directedBy');
let starring = document.getElementById('starring');
let boxOf = document.getElementById('boxOf');
let awards = document.getElementById('awards');
let rating = document.getElementById('rating');

// Функція GET (отримання усіх фільмів по запиту "Назви фільму" '&s')
const getData = async () => {

  let getName = movieName.value;

  try {

    let response = await fetch(`http://www.omdbapi.com/?apikey=caa214e6&s=${getName}`);
    let someJson = await response.json()

    await Promise.all([response, someJson])

      .then(receivedDAta => {
        // Виклик функції генератора сторінки.
        buildPage(receivedDAta[1]);
      })
      // Після генерування усіх елементів , добавляємо додаткові стилі для візуального еффекту.
      .then(() => {
        let mainDivs = document.querySelectorAll('.mainDiv');
        for (let i = 0; i < mainDivs.length; i++) {
          mainDivs[i].style.opacity = 1;
        }
      })

  } catch (error) {
    // Якщо не знаходимо фільм по вказаній назві - видаємо помилку ,що такий не існує.
    if (error.name === 'TypeError') {
      movieName.style.color = 'red'
      throw new Error('Wrong name');
    }
  }
}

// Функція GET (отримання данних по конкретному фільму залежно від його Title '&t')
const getInfo = async (info) => {

  try {

    let response = await fetch(`http://www.omdbapi.com/?apikey=caa214e6&t=${info}`);
    let someJson = await response.json()

    await Promise.all([response, someJson])
      // Після отриманих данних по фільму надаємо ці данні функції виклику модального вікна;
      .then(receivedDAta => buildModal(receivedDAta[1]))

  } catch (error) {
    console.log(error)
  }

}

// Фунція генератор сторінки з усіма фільмами,після отримання данних від сервера.
function buildPage(data) {
  let allFilms = data.Search;
  filmContainer.innerHTML = '';
  document.querySelector('.filmName').style.color = 'black'

  for (let i = 0; i < allFilms.length; i++) {

    let mainDiv = document.createElement('div');
    mainDiv.classList.add('mainDiv')
    let img = document.createElement('img');

    if (allFilms[i].Poster !== 'N/A') {
      img.src = `${allFilms[i].Poster}`
    } else {
      img.src = 'https://bytes.ua/wp-content/uploads/2017/08/no-image.png'
      img.style.backgroundColor = 'white';
    }

    let info = document.createElement('div')
    info.classList.add('info');
    let title = document.createElement('h1');
    title.innerText = `${allFilms[i].Title}`

    if (allFilms[i].Title.length > 15) {
      title.style.fontSize = '26px';
      title.style.textAlign = 'center'
    }

    let type = document.createElement('h3');
    type.innerText = `${allFilms[i].Type}`
    let year = document.createElement('h3');
    year.innerText = `${allFilms[i].Year}`;
    let button = document.createElement('input');

    button.type = 'button'
    button.value = 'More Details'
    // Вішаємо подію вибору фільма.
    button.addEventListener('click', chooseMovie)
    info.append(title);
    info.append(type);
    info.append(year);
    info.append(button);
    mainDiv.append(img);
    mainDiv.append(info);
    filmContainer.append(mainDiv)
    document.querySelector('.filmName').value = ''
  }
}

//Генеруємо усі данні , які отримали від функції Get.
function buildModal(data) {

  //Зачищаємо усі поля при повторному виклику модального вікна.
  writtenBy.innerText = '';
  directedBy.innerText = '';
  starring.innerText = '';
  boxOf.innerText = '';
  awards.innerText = '';
  rating.innerText = '';
  modal.style.height = '90%'
  modal.style.opacity = 1;
  modalImg.style.opacity = 1;
  rightContent.style.opacity = 1;
  modalImg.src = `${data.Poster}`
  let titleToUpper = data.Title.toUpperCase();
  modalTitle.innerText = `${titleToUpper}`;
  smallInfo.innerText = `${data.Rated} ${data.Year} ${data.Genre}`;
  plot.innerText = `${data.Plot}`;
  writtenBy.innerText += ` ${data.Writer}`;
  directedBy.innerText += ` ${data.Director}`;
  starring.innerText += ` ${data.Actors}`;
  boxOf.innerText += ` ${data.BoxOffice}`;
  awards.innerText += ` ${data.Awards}`;

  for (let i = 0; i < data.Ratings.length; i++) {
    const ratings = data.Ratings[i];
    rating.innerText += `\n${ratings.Source}  ${ratings.Value}\n`;
  }

}

// Функція визначення фільму по кліку на кпопку.
// А також виклик wrappera і модалки.
function chooseMovie(event) {

  let name = event.target.parentElement.firstChild.innerText;
  wrapper.style.zIndex = 2;
  wrapper.style.opacity = 0.5;
  modal.style.display = 'flex';
  modal.style.opacity = 0;
  modal.style.zIndex = 2;

  //Відправляємо назву філмьу функції GET,для отримання данних.
  getInfo(name);

}


// При кліку по wrapper приховуємо його і модальне вікно.
wrapper.addEventListener('click', function (event) {

  event.target.style.zIndex = '-1';
  wrapper.style.opacity = 0;
  modal.style.height = '0%'
  modal.style.opacity = 0;
  modal.style.zIndex = -1;
  modalImg.style.opacity = 0;
  rightContent.style.opacity = 0;

})

// Пошук фільма при кліку на кнопку 'Search'
searchs.addEventListener('click', function (event) {
  if (movieName.value !== '') {
    getData();
  } else alert('Введіть назву фільму')
})

// Можливість пошуку фільма після введеної назви при натисканні на клавішу 'Enter'
window.addEventListener('keydown', function (event) {

  if (event.key === 'Enter' && movieName.value !== '') {
    getData();
  } else if (event.key === 'Enter' && movieName.value === '') alert('Введіть назву фільму')

})