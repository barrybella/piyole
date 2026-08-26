// Ce fichier centralise les listes de scripts jQuery/plugins externes à charger
// dynamiquement selon la page ou le composant actif (voir js.service.ts).

// Scripts communs chargés au niveau du composant racine de l'application.
export const ScriptStore = [
  "assets/js/vendors/jquery-3.2.1.min.js",
  "assets/plugins/bootstrap-4.3.1-dist/js/popper.min.js",
  "assets/plugins/bootstrap-4.3.1-dist/js/bootstrap.min.js",
  "assets/js/vendors/jquery.sparkline.min.js",
  "assets/js/vendors/circle-progress.min.js",
  "assets/plugins/rating/jquery.rating-stars.js",
  // "assets/plugins/counters/counterup.min.js",
  // "assets/plugins/counters/waypoints.min.js",
  // "assets/plugins/counters/numeric-counter.js",
  "assets/plugins/owl-carousel/owl.carousel.js",
  "assets/plugins/horizontal-menu/horizontal.js",
  "assets/js/jquery.touchSwipe.min.js",
  "assets/plugins/select2/select2.full.min.js",
  // "assets/js/select2.js",
  "assets/js/sticky.js",
  "assets/plugins/cookie/jquery.ihavecookies.js",
  "assets/plugins/cookie/cookie.js",
  "assets/plugins/scroll-bar/jquery.mCustomScrollbar.concat.min.js",
  "assets/plugins/pscrollbar/perfect-scrollbar.js",
  "assets/plugins/pscrollbar/pscroll.js",
  "assets/js/jquery.showmore.js",
  "assets/js/showmore.js",
  "assets/js/swipe.js",
  // "assets/js/owl-carousel.js",
  "assets/js/custom.js",
   "assets/plugins/fancyuploder/jquery.ui.widget.js",    //========>IMAGE
   "assets/plugins/fancyuploder/jquery.fileupload.js",
   "assets/plugins/fancyuploder/jquery.iframe-transport.js",
   "assets/plugins/fancyuploder/jquery.fancy-fileupload.js",
   "assets/plugins/fancyuploder/fancy-uploader.js",
];



// Scripts spécifiques à la page d'accueil (carrousel, compteurs animés, etc.).
export const ScriptStoreHome = [
  "assets/js/owl-carousel.js",
  "assets/js/select2.js",
  "assets/plugins/counters/counterup.min.js",
  "assets/plugins/counters/waypoints.min.js",
  "assets/plugins/counters/numeric-counter.js",
  // "assets/plugins/rating/jquery.rating-stars.js"
];

// Scripts spécifiques à la page d'ajout de besoin.
export const ScriptStoreAddBesoin = [
  "assets/js/owl-carousel.js",
  "assets/js/select2.js",
];

// Scripts spécifiques à la page de rapport de construction (frise chronologique).
export const ScriptStoreRaportConstruction = [
  "assets/plugins/timeline/timeline.min.js",
  "assets/js/timeline.js"
];

// Sous-ensemble minimal de scripts chargés au démarrage de l'application
// (plusieurs entrées sont volontairement commentées/désactivées ici).
export const ScriptStoreStart = [
  // "assets/js/vendors/jquery-3.2.1.min.js",
  // "assets/plugins/bootstrap-4.3.1-dist/js/popper.min.js",
  // "assets/plugins/bootstrap-4.3.1-dist/js/bootstrap.min.js",
  // "assets/js/vendors/jquery.sparkline.min.js",
  // "assets/js/vendors/circle-progress.min.js",
  "assets/plugins/rating/jquery.rating-stars.js",
  // "assets/plugins/counters/counterup.min.js",
  // "assets/plugins/counters/waypoints.min.js",
  // "assets/plugins/counters/numeric-counter.js",
  // "assets/plugins/owl-carousel/owl.carousel.js",
  // "assets/plugins/horizontal-menu/horizontal.js",
  // "assets/js/jquery.touchSwipe.min.js",
  // "assets/plugins/select2/select2.full.min.js",
  // "assets/js/select2.js",
  "assets/js/sticky.js",
  "assets/plugins/cookie/jquery.ihavecookies.js",
  "assets/plugins/cookie/cookie.js",
  "assets/plugins/scroll-bar/jquery.mCustomScrollbar.concat.min.js",
  // "assets/plugins/pscrollbar/perfect-scrollbar.js",
  // "assets/plugins/pscrollbar/pscroll.js",
  // "assets/js/jquery.showmore.js",
  // "assets/js/showmore.js",
  // "assets/js/swipe.js",
  // "assets/js/owl-carousel.js",
  "assets/js/custom.js",
  //  "assets/plugins/fancyuploder/jquery.ui.widget.js",    //========>IMAGE
  //  "assets/plugins/fancyuploder/jquery.fileupload.js",
  //  "assets/plugins/fancyuploder/jquery.iframe-transport.js",
  //  "assets/plugins/fancyuploder/jquery.fancy-fileupload.js",
  //  "assets/plugins/fancyuploder/fancy-uploader.js",
];

// <script src="../assets/plugins/timeline/timeline.min.js"></script>


