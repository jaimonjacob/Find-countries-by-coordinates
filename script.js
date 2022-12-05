const artContainer = document.querySelector('.cardsContainer');
const form = document.querySelector(`.search--form`);
const formInput = document.querySelector(`.search--text`);

const renderData = function (inputData) {
  inputData.forEach((el) => {
    const html = `
   <div class="column data--card is-one-quarter">
          <a href=# title=${el.name.common} target="_blank">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img src=${el.flags.png}
                 alt="Placeholder image">
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                
                <div class="media-content">
                  <p class="title is-4">${el.name.official}</p>
                </div>
              </div>

              <div class="content">
                ${el.subregion}
              </div>
            </div>
          </div>
          </a>
        </div>`;
    artContainer.insertAdjacentHTML('afterbegin', html);
  });
};

const renderError = function (error) {
  artContainer.insertAdjacentText('beforeend',`An error has occured. 🚩🚩🚩... ${error}`
  );
};

const getCountryData = function (e) {
  e.preventDefault();
  artContainer.replaceChildren();
  const [lat, lng] = formInput.value.split(`,`);  
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
    .then((response) => {
      if(!response.ok){
        throw new Error(`The entered coordinates do not represent any country - The error code is ${response.status}`)
      }
      return response.json()
      })
    .then(data => {
      console.log(data)
      return fetch(`https://restcountries.com/v3.1/alpha/${data.countryCode}`);
    })
    .then(response => {
        if(!response.ok){
        throw new Error(`There is no such country code - The error code is ${response.status}`)
      }
      return response.json()
    })
    .then(data => renderData(data))
    .catch(err => renderError(err))
    .finally(message => console.log(`The request is processed`));
};

form.addEventListener(`submit`, getCountryData);

  fetch(
    `https://us1.locationiq.com/v1/reverse?key=pk.077016d2f446620565503cac90f8ae5a&lat=37.870662&lon=144.9803321&format=json`)
    .then(response => console.log(response))
      