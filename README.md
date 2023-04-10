# Ad Blocker Notice Removal

Chrome extension to remove the ad blocker notice on popular sites.

Install from the [Chrome Web Store](https://chrome.google.com/webstore/detail/ad-blocker-notice-removal/bnohpbaeckhhfnfijdnapgmbldkigchl).

Icons made by [DinosoftLabs](https://www.flaticon.com/authors/dinosoftlabs).

## Contributing

If you see an ad blocker notice on a website, feel free to report it in the [issues](https://github.com/fire015/adblocker-notice-removal/issues) section.

If you are comfortable with Javascript, you can add it to the rules file and create a pull request (see below).

## Local Development

1. Fork the repository
2. Clone the forked repository locally
3. From the `master` branch, create and checkout a new feature branch to work upon
4. Click the 'Load unpacked' button in chrome://extensions and choose the folder
5. Make your changes and test them
6. Push the changes to your github repository
7. Submit a pull request from your repo back to the original repository
8. Once it is accepted, a new update will be published to the Chrome Web Store

## Adding/Editing Website Rules

The `rules.json` file is made up of a list of websites and the known DOM elements that show the ad blocker notice on the page.

When a user visits a matching website, the extension watches for the DOM elements to be created and then removes them. It also removes the hidden overflow on the html and body tags.

The key of each object is unique and can contain multiple websites. Try to use the parent company as the key name if possible, as the websites tend to all behave the same way.

Each object requires a `matches` array and an `elementsToRemove` array.

The `matches` array contains the hostnames and each one is string compared from right to left against the current hostname.

- Example: `foo.com` will match `https://www.foo.com` and `https://news.foo.com`
- Example: `www.foo.com` will match `https://www.foo.com` but not `https://news.foo.com`

The `elementsToRemove` array takes a [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors) such as `.class` or `#id` to remove.

### Optional values
You can pass in a `removalAttempts` integer that will increase the number of attempts it makes to remove an element (sometimes the element is in the DOM but the display is hidden for a longer period of time before becoming visible). The extension does 5 attempts per second and gives up after 25 attempts by default (so 5 seconds in total).

You can pass in a `topClassToRemove` string to check and remove the class in the html and body elements.

If you make a change to the `rules.json` file and submit a pull request, please also bump the version in the `manifest.json` file.

Thanks for your contribution!