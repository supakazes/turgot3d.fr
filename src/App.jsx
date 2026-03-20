function App() {
  return (
    <>
      <h1>Turgot 3D</h1>
      <h2>Building the Turgot map of Paris in 3D for the web.</h2>
      <p>
        The Turgot map of Paris is a detailed representation with perspective of the city in the
        18th century. This project aims to create a 3D version of this map for the web, allowing
        users to explore it in a new way. The project is still in its early stages, but the road map
        includes several steps, such as: creating a very precise map with QGIS, generating the 3D
        modeling from this map, complete with custom models like churches and bridges, web
        development with threejs, and of course historical research to ensure accuracy and detail in
        the representation of the city.
      </p>
      <a
        href="https://en.wikipedia.org/wiki/Turgot_map_of_Paris"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/plan-turgot.jpg" alt="Turgot map of Paris" width="100%" />
      </a>

      <h2>Verniquet.fr</h2>
      <p>
        The Turgot map's original representation is very detailed and accurate but sometimes
        involves distortions like, for example, widening of the streets in order to display the
        building facades. Because of this and because the perspective does not allow you to see
        what's behind the buildings I needed to rely on a precise map of this period to create the
        Turgot map. I layered the Verniquet map from 1790, which is the most accurate map of Paris
        in the 18th century, on top of the actual city map.
      </p>
      <p>
        This is a precious tool and you can explore it here:
        <br />
        <a
          href="https://www.verniquet.fr/?lng=2.36216&lat=48.86509&z=17.28"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.verniquet.fr
        </a>
      </p>
      <a
        href="https://www.verniquet.fr/?lng=2.36216&lat=48.86509&z=17.28"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/verniquet.fr.webp" alt="Verniquet.fr" width="100%" />
      </a>
      <p>
        Follow the project on Bluesky:
        <br />
        <a
          href="https://bsky.app/profile/turgot3d.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://bsky.app/profile/turgot3d.bsky.social
        </a>
      </p>
    </>
  );
}

export default App;
