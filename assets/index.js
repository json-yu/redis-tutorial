const helpButton = document.getElementById('help-button');
const resetButton = document.getElementById('reset-button');

const callForHelp = () => {
  fetch('/help')
    .then(res => res.json())
    .then(hero => {
      if (hero.status === 400) {
        console.log('Error when calling for help. Please try again.');
        return;
      };
      console.log(hero);
      document.getElementById('hero-name').innerHTML = hero.name;
      document.getElementById('hero-picture').src = hero.image;
    })
    .catch(err => {
        console.log('hit');
    //   console.log(err);
    })
}

helpButton.addEventListener('click', callForHelp);