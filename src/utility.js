function getIssueURL(currentURL) {
  const params = {
    title: "Issue with website",
    body: "",
  };

  const question =
    "Which country are you browsing from? [ANSWER HERE]\n\nPlease take a screenshot of the adblocker notice and drag and drop the image here if possible.";

  if (currentURL) {
    params["body"] = currentURL + "\n\n" + question;
  } else {
    params["body"] = "URL:\n\n" + question;
  }

  const queryString = new URLSearchParams(params).toString();

  return "https://github.com/fire015/adblocker-notice-removal/issues/new?" + queryString;
}
