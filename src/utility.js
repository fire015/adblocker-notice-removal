function getIssueURL(currentURL) {
  const params = {
    title: "Issue with website",
    body: "",
  };

  if (currentURL) {
    params["body"] = currentURL + "\n\nPlease provide more details here including your location (country) and any screenshots";
  } else {
    params["body"] = "Please provide the URL and details here including your location (country) and any screenshots";
  }

  const queryString = new URLSearchParams(params).toString();

  return "https://github.com/fire015/adblocker-notice-removal/issues/new?" + queryString;
}
