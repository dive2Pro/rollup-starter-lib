const { React, ReactDOM, Blueprint } = window;
const roam_main_el = document.querySelector(".roam-main");
const roam_body_main_el = document.querySelector(".roam-body-main");

const { Tabs, Tab } = Blueprint.Core;
const { useEffect, useState } = React;
const log = console.log.bind(console.log);

console.log = (...args) => {
  log(...args);
};

function isClickOnPageRef(el: EventTarget) {
  // return el.className.includes('rm-page-ref rm-page-ref--link')
  return $(el).find(".rm-page-ref.rm-page-ref--link").get();
}

function findPageuid(el: EventTarget) {
  return $(el).parent().attr("data-link-uid");
}

let initial = (extensionAPI: any) => {
  log("roam-tabs initialing");
  log(roam_main_el, React);
  const el = document.createElement("nav");
  roam_main_el?.insertBefore(el, roam_body_main_el);

  function App() {
    const [uids, setUids] = useState<string[]>([]);

    useEffect(() => {
      const onPointerdown = (e: PointerEvent) => {
        if (!e.ctrlKey) {
          return false;
        }
        if (!isClickOnPageRef(e.target)) {
          return false;
        }
        const uid = findPageuid(e.target);
        if (!uid) {
          return false;
        }
        setUids((prevUids) => {
          const index = prevUids.findIndex((id) => id === uid);
          if (index === -1) {
            return [...prevUids, uid];
          }
          return prevUids;
        });
      };
      document.addEventListener("pointerdown", onPointerdown);
      return () => {
        document.removeEventListener("pointerdown", onPointerdown);
      };
    }, []);
    const [navbarTabId, setNavbarTabId] = useState("");
    const handleNavbarTabChange = (id: string) => {
      setNavbarTabId(id);
    };
    return (
      <Tabs onChange={handleNavbarTabChange} selectedTabId={navbarTabId}>
        {uids.map((uid) => {
          return <Tab title="one" key={uid} id={uid} />;
        })}
      </Tabs>
    );
  }

  ReactDOM.render(React.createElement(App), el);

  return () => {
    roam_main_el?.removeChild(el);
  };
};
let initialed: Function;
function onload({ extensionAPI }: any) {
  initialed = initial(extensionAPI);
}

function onunload() {
  initialed();
}

export default {
  onload,
  onunload,
};
