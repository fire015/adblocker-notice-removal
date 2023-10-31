class CustomScripts {
  w3resource(done) {
    document.addEventListener("DOMContentLoaded", () => {
      // wait for style change
      document.arrive("#w3r_body", { fireOnAttributesModification: true }, (e) => {
        if (e.style.display === "none") {
          e.style.display = "block";

          // remove last h2 element
          const h2 = document.getElementsByTagName("h2");

          if (h2.length) {
            h2[h2.length - 1].remove();
          }

          done();
        }
      });
    });
  }

  wordpress_plugin_chp(done) {
    // https://wordpress.org/plugins/chp-ads-block-detector/
    document.arrive(".adblock_title", { onceOnly: true }, (e) => {
      const div = e.parentNode.parentNode.parentNode.parentNode.parentNode;

      if (div) {
        div.remove();
        done();
      }
    });
  }

  wordpress_plugin_ad_inserter(done) {
    // https://en-gb.wordpress.org/plugins/ad-inserter/
    document.arrive("div[style*='z-index: 33846']", { onceOnly: true }, (e) => {
      const p = e.parentNode;

      if (p) {
        const ins = document.getElementsByTagName("ins");

        for (let i = 0; i < ins.length; i++) {
          if (ins[i].firstElementChild && ins[i].firstElementChild.tagName == "SECTION") {
            ins[i].remove();
          }
        }

        p.remove();
        done();
      }
    });
  }

  zive(done) {
    document.arrive("a[title='Povolit reklamu']", { onceOnly: true }, (e) => {
      const div = e.parentNode.parentNode.parentNode.parentNode;

      if (div) {
        div.remove();
        done();
      }
    });
  }
}
