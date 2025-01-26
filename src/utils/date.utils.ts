import moment from "moment"

moment.locale("fr", {
    months:
      "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split(
        "_"
      ),
    weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    relativeTime: {
      future: "%s",
      past: "%s",
      s: "1s",
      m: "1min",
      mm: "%dmin",
      h: "1h",
      hh: "%dh",
      d: "1j",
      dd:  function (number:any) {
        const weeks = Math.round(number / 7);
        if (number < 7) {
          // if less than a week, use days
          return number + "j";
        } else {
          // pluralize weeks
          return weeks + " sem" + (weeks === 1 ? "" : ""); 
        }
      },
      M: "1 mois",
      MM: "%dmois",
      y: "1 an",
      yy: "%dans",
    },
  });
  
  moment.locale("fr");