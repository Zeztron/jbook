import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache'
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      // onLoad caching layer.
      build.onLoad({ filter: /.*/}, async (args: any) => {
        // Check to see if we have already fetched this file
        // and if it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        
        // if it is, return it immediately
        if (cachedResult) return cachedResult;
      });

      build.onLoad({ filter: /.css$/}, async (args: esbuild.OnLoadArgs) => {

        const { data, request } = await axios.get(args.path);

        // CSS files might contain escape characters and JS will try to escape the string early.
        const escaped = data
          .replace(/\n/g, '') // Escape new lines
          .replace(/"/g, '\\"') // Escape double quotes
          .replace(/'/g, "\\'"); // Escape single quotes

        const contents =  `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style); `
          
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname
        };

        // Store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname
        };

        // Store response in cache
        await fileCache.setItem(args.path, result);

        return result;

      });
    }
  };
};