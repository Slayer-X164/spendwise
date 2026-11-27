export function createBrowserStorage(key: string) {
  let memory: string | null = null;

  function read() {
    try {
      return memory ?? window.localStorage.getItem(key);
    } catch {
      return memory;
    }
  }

  function write(value: string) {
    try {
      window.localStorage.setItem(key, value);
      memory = null;
    } catch {
      memory = value;
    }
    window.dispatchEvent(new Event(key));
  }

  function subscribe(onChange: () => void) {
    function onStorage(event: StorageEvent) {
      if (event.key === key || event.key === null) onChange();
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener(key, onChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(key, onChange);
    };
  }

  return { read, write, subscribe };
}
