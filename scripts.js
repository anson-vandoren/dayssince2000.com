"use strict";

const epoch = new Date(2000, 0, 1, 0, 0, 0);
console.log(epoch);

const verInput = document.getElementById("input-version");
const buildInput = document.getElementById("input-build");
const calcBuildDate = document.getElementById("calculated-build-date");

Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.addSeconds = function(seconds) {
  let date = new Date(this.valueOf());
  date.setSeconds(date.getSeconds() + seconds);
  return date;
};

function updateCurrentVersion() {
  if (document.readyState !== "complete") {
    return;
  }
  let now = new Date();
  let midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  let buildNum = Math.floor(
    1 + (now.getTime() - epoch.getTime()) / 86400000
  ).toString();

  let versionNum = Math.floor((now - midnight) / 2000).toString();
  const verString = `X.Y.${buildNum}.${versionNum}`;
  document.getElementById("current-version").innerHTML = verString;
}

function updateBuildDate() {
  let dateString = "2000-01-01";
  let timeString = "12:00:00";

  const buildNum = parseInt(buildInput.value);
  const verNum = parseInt(verInput.value);

  if (!isNaN(buildNum)) {
    const buildDate = epoch.addDays(buildNum - 1);
    const dtFormat = new Intl.DateTimeFormat("en");
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year }
    ] = dtFormat.formatToParts(buildDate);
    dateString = `${year}-${month}-${day}`;
  }

  if (!isNaN(verNum)) {
    const buildTime = epoch.addSeconds(verNum * 2);
    timeString = buildTime.toLocaleTimeString();
  }

  calcBuildDate.innerHTML = `${dateString} ${timeString}`;
}

document.addEventListener("DOMContentLoaded", () => {
  setInterval(updateCurrentVersion, 2000);
  buildInput.onkeydown = validateKeypress;
  buildInput.onkeyup = updateBuildDate;
  buildInput.tabIndex = 1;

  verInput.onkeydown = validateKeypress;
  verInput.onkeyup = updateBuildDate;
  verInput.tabIndex = 2;
});

const maxChars = { "input-build": 4, "input-version": 5 };
function validateKeypress(e) {
  // allow moving left/right and deleting
  const allowedKeys = ["Delete", "Backspace", "ArrowLeft", "ArrowRight", "Tab"];
  if (allowedKeys.includes(e.key)) return true;
  // allow Cmd/Ctrl+A for select all
  if (e.metaKey || e.ctrlKey) return true;
  // can try to type if text is already selected
  const textIsSelected = e.target.selectionStart !== e.target.selectionEnd;

  // check if a number was entered, and length is short enough
  const isNumber = !isNaN(e.key);
  const isValidLength = e.target.value.length < maxChars[e.target.id];
  return isNumber && (isValidLength || textIsSelected);
}
