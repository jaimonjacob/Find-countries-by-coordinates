const artContainer = document.querySelector('.cardsContainer');
const form = document.querySelector(`.search--form`);
const searchInstr = document.querySelector('.search--instr');
const appInfo = document.querySelector('.app--info');
searchInstr.textContent = `Enter the coordinates separated by comma to see the country`
appInfo.textContent = `This site is an API testing app created by Jaimon. Please use the form below to see the latest data. This app lets you enter coordinates separated by comma, for example - 23,78 - and the app will retrieve the country that the coordinates belong to.`

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
  artContainer.insertAdjacentText(
    'beforeend',
    `An error has occured. 🚩🚩🚩... ${error}`
  );
};


//USING ASYNC
//Use the async keyword to convert any function to async
const getCountryData = async function (e) {
  //Using try--catch to handle errors
  try {

    e.preventDefault();
    artContainer.replaceChildren();
    const [lat, lng] = formInput.value.split(`,`);
    //Use await keyword to make any command wait
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    const data = await response.json()
    //Creating a custom error to  handle error of invalid entry
    if (!response.ok) {
      throw new Error(
        `The entered coordinates are invalid; please recheck - The error code is ${response.status}`
      )
    }

    const countryresponse = await fetch(`https://restcountries.com/v3.1/alpha/${data.countryCode}`);
    const countryData = await countryresponse.json();
    //Creating a custom error to  handle error of invalid input
    if (!countryresponse.ok) {
      throw new Error(
        `The coordinates do not belong to a country; mostly belong to sea or the poles :-) - The error code is ${response.status}`
      )
    }

    renderData(countryData)
  } catch (err) {//Catching and acting on error
    renderError(err)
  }

}

form.addEventListener(`submit`, getCountryData);
