// @flow
type Fetch = (url: string, options: ?any) => Promise<any>;

type Options = {
  baseUrl: string,
  cookie?: string,
};

type QueryStrings = {
  [string]: string,
};

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT',
  body?: string,
  headers?: {
    [string]: string,
  },
  // not part of the spec, we added query string convenience
  qs?: QueryStrings,
  [string]: any,
};

export type CustomFetch = (url: string, options?: FetchOptions) => Promise<any>;

const addQs = (url: string, qs?: QueryStrings) =>
  qs
    ? (() => {
        const addPrefix = !/http(s?):\/\//.test(url);
        const theUrl = new URL(addPrefix ? `https://${url}` : url);
        // ugh... whatwg-fetch: https://github.com/github/fetch/issues/256
        Object.keys(qs).forEach(key => qs[key] && theUrl.searchParams.append(key, qs[key]));
        return theUrl.href;
      })()
    : url;

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
function createFetch(fetch: Fetch, { baseUrl, cookie }: Options): CustomFetch {
  const defaults = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const apiDefaults = {
    ...defaults,
    mode: baseUrl ? 'cors' : 'same-origin',
    credentials: baseUrl ? 'include' : 'same-origin',
    headers: {
      ...defaults.headers,
      ...(cookie ? { Cookie: cookie } : null),
    },
  };

  return async (url: string, passedOptions?: FetchOptions) => {
    const { headers, qs, ...options } = passedOptions || {};
    return (/^\/api/.test(url)
      ? fetch(addQs(`${baseUrl}${url}`, qs), {
          ...apiDefaults,
          // $FlowFixMe
          ...options,
          headers: {
            ...apiDefaults.headers,
            // $FlowFixMe
            ...headers,
          },
        })
      : fetch(addQs(url, qs), { ...options, headers })
    ).then(async (r: Response) => {
      if (!r.ok) {
        try {
          const body = await r.json();
          return Promise.reject(new Error(`Fetch failed: ${body.message}`));
        } catch (err) {
          return Promise.reject(new Error('Fetch failed: unknown reason'));
        }
      }
      return r;
    });
  };
}

export default createFetch;
