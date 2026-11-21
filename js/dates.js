/* =========================================================
   SCHOOL DATES AND EXAM TIMETABLE
   ---------------------------------------------------------
   All dates on the Calendar page come from ONE list:

       data/dates.csv

   To change a date, edit that file (or the Google Sheet,
   if you switch to one below). Each row is one date:

       Type      -> Important date, A Level or GCSE
       Name      -> e.g. School Re-opens, Paper 1, Listening
       Date      -> written exactly as you want it shown
       Time      -> optional (e.g. AM, PM, 12:00 PM)
       Details   -> optional extra line / exam length

   To use a Google Sheet instead, publish the sheet as CSV
   (File > Share > Publish to web > CSV) and paste that link
   between the quotes below.
   ========================================================= */

var DATES_SOURCE = "data/dates.csv";


function parseCSV(text) {
    var rows = [], row = [], field = "", inQuotes = false;
    text = text.replace(/^﻿/, "");
    for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if (inQuotes) {
            if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
            else if (c === '"') { inQuotes = false; }
            else { field += c; }
        } else if (c === '"') { inQuotes = true; }
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n" || c === "\r") {
            if (c === "\r" && text[i + 1] === "\n") i++;
            row.push(field); rows.push(row); row = []; field = "";
        } else { field += c; }
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    var head = rows.shift().map(function (h) { return h.trim().toLowerCase(); });
    return rows
        .filter(function (r) { return r.join("").trim() !== ""; })
        .map(function (r) {
            var o = {};
            head.forEach(function (h, k) { o[h] = (r[k] || "").trim(); });
            return o;
        });
}

function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
}

function showDates(list) {
    var grid = document.getElementById("important-dates-grid");
    var alevel = document.querySelector("#alevel-table tbody");
    var gcse = document.querySelector("#gcse-table tbody");
    [grid, alevel, gcse].forEach(function (x) { if (x) x.innerHTML = ""; });

    list.forEach(function (d) {
        var type = (d.type || "").toLowerCase();

        if (type.indexOf("important") === 0 && grid) {
            var card = el("div", "date-card");
            card.appendChild(el("h3", "", d.name));
            card.appendChild(el("div", "date", d.date + (d.time ? " – " + d.time : "")));
            if (d.details) card.appendChild(el("p", "", d.details));
            grid.appendChild(card);
        }

        var body = type === "a level" ? alevel : type === "gcse" ? gcse : null;
        if (body) {
            var tr = document.createElement("tr");
            [d.name, d.details || "—", d.date, d.time || "—"].forEach(function (v) {
                tr.appendChild(el("td", "", v));
            });
            body.appendChild(tr);
        }
    });
}

function datesFailed() {
    var grid = document.getElementById("important-dates-grid");
    if (grid) {
        grid.innerHTML = '<p>Sorry, the dates could not be loaded right now. ' +
            'Please see the <a href="documents/Calendar.pdf" target="_blank">School Calendar PDF</a>.</p>';
    }
}

fetch(DATES_SOURCE, { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (t) { showDates(parseCSV(t)); })
    .catch(datesFailed);
