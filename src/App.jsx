import { useEffect, useMemo, useState } from 'react'

const apiKey = import.meta.env.VITE_API_KEY

function App() {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [error, setError] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const quickPicks = [
    'Desert memoir',
    'Cozy mystery',
    'Modern mythology',
    'Japanese design',
    'Afrofuturism',
  ]
  const recommendedReads = [
    {
      title: 'The Night Circus',
      author: 'Erin Morgenstern',
      note: 'Atmospheric fantasy, luminous and immersive.',
      link: 'https://books.google.com/books?hl=en&vid=ISBN9780385534635',
    },
    {
      title: 'Pachinko',
      author: 'Min Jin Lee',
      note: 'Epic family saga across generations.',
      link: 'https://books.google.com/books?hl=en&vid=ISBN9781455563937',
    },
    {
      title: 'The Overstory',
      author: 'Richard Powers',
      note: 'Interwoven lives shaped by forests.',
      link: 'https://books.google.com/books?hl=en&vid=ISBN9780393356687',
    },
  ]

  const searchBooks = async (overrideQuery) => {
    const trimmed = (overrideQuery ?? query).trim()
    if (!trimmed) {
      setError('Enter a search term to begin.')
      return
    }

    setError('')
    setIsLoading(true)
    setBooks([])

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(trimmed)}&maxResults=12&key=${apiKey}`
      )
      if (!res.ok) throw new Error('Api error')
      const data = await res.json()
      setBooks(data.items || [])
    } catch (err) {
      setError('Something went wrong. Try again in a moment.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedBook(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const hasResults = books.length > 0
  const resultsLabel = useMemo(() => {
    if (isLoading) return 'Searching the stacks...'
    if (!hasResults && !error) return 'Start with a title, author, or topic.'
    if (!hasResults) return 'No books found yet.'
    return `${books.length} titles`
  }, [books.length, error, hasResults, isLoading])

  return (
    <>
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <header className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-[#c9b194] bg-white/70 px-4 py-2 text-sm uppercase tracking-[0.25em] text-[#594234] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#b07b42]"></span>
              Welcome back to curated reading
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-5">
                <h1 className="font-serif text-4xl leading-tight text-[#1f140c] sm:text-5xl">
                  Book Discovery for thoughtful, tactile browsing
                </h1>
                <p className="max-w-xl text-lg text-[#5a4a3d]">
                  Search the Google Books catalog and surface the editions that feel right for your next deep dive.
                </p>
              </div>
              <div className="rounded-3xl border border-[#d7c2a5] bg-white/80 p-6 shadow-[0_20px_50px_rgba(75,50,20,0.15)]">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(event) => {
                    event.preventDefault()
                    searchBooks()
                  }}
                >
                  <label className="text-sm font-medium uppercase tracking-[0.2em] text-[#7a5c40]">
                    Search the stacks
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      className="h-12 flex-1 rounded-2xl border border-[#d7c2a5] bg-white px-4 text-base text-[#1f140c] shadow-sm outline-none ring-offset-2 focus:border-[#b07b42] focus:ring-2 focus:ring-[#b07b42]/40"
                      placeholder="Search books, authors, or topics"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <button
                      type="submit"
                      className="h-12 rounded-2xl bg-[#1f140c] px-6 text-base font-semibold text-[#f9efe3] transition hover:-translate-y-0.5 hover:bg-[#3a2616] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {quickPicks.map((pick) => (
                      <button
                        key={pick}
                        type="button"
                        className="rounded-full border border-[#e6d4be] bg-[#fff7ee] px-3 py-1 text-xs font-semibold text-[#7a4d1f] transition hover:border-[#b07b42] hover:bg-[#fdf2e5]"
                        onClick={() => {
                          setQuery(pick)
                          searchBooks(pick)
                        }}
                      >
                        {pick}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-[#7c6a5c]">Tip: try combining a topic and mood, like “desert memoir”.</p>
                </form>
              </div>
            </div>
          </header>

          <section className="mt-12 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-[#2c1c12]">Browse results</h2>
                <p className="text-sm text-[#7c6a5c]">
                  {query.trim() ? `Showing results for "${query.trim()}"` : 'Start with a title, author, or topic.'}
                </p>
                <p className="text-sm text-[#7c6a5c]" aria-live="polite">
                  {resultsLabel}
                </p>
              </div>
              {apiKey ? null : (
                <div className="rounded-2xl border border-[#f0b278] bg-[#fff4e8] px-4 py-2 text-sm text-[#7a4d1f]">
                  Add your Google Books API key in <span className="font-semibold">VITE_API_KEY</span> to fetch results.
                </div>
              )}
            </div>

            {error ? (
              <div className="rounded-2xl border border-[#e9b27d] bg-[#fff1e3] px-4 py-3 text-sm text-[#7a4d1f]">
                {error}
              </div>
            ) : null}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="flex h-40 animate-pulse flex-col justify-between rounded-3xl border border-[#e6d4be] bg-white/70 p-4"
                    >
                      <div className="h-20 rounded-2xl bg-[#efe5d7]"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-3/4 rounded-full bg-[#e6d4be]"></div>
                        <div className="h-3 w-1/2 rounded-full bg-[#eddac4]"></div>
                      </div>
                    </div>
                  ))
                : books.map((item) => {
                    const info = item.volumeInfo || {}
                    const cover = info.imageLinks?.thumbnail?.replace('http:', 'https:')
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setSelectedBook(item)}
                        className="group flex h-full flex-col gap-4 rounded-3xl border border-[#e6d4be] bg-white/80 p-4 text-left shadow-[0_18px_40px_rgba(75,50,20,0.12)] transition hover:-translate-y-1 hover:border-[#c7a57b]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f3d6b4] via-[#e8c09a] to-[#c8925e]">
                            {cover ? (
                              <img
                                src={cover}
                                alt={info.title || 'Book cover'}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : null}
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a06f3f]">
                              {info.categories?.[0] || 'Featured read'}
                            </p>
                            <h3 className="text-lg font-semibold text-[#2c1c12] group-hover:text-[#7a4d1f]">
                              {info.title || 'Untitled'}
                            </h3>
                            <p className="text-sm text-[#6a5a4b]">
                              {info.authors?.join(', ') || 'Unknown Author'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#8c7a6a]">
                          <span>{info.publishedDate || 'Unknown year'}</span>
                          <span>{info.pageCount ? `${info.pageCount} pages` : 'Page count N/A'}</span>
                        </div>
                      </button>
                    )
                  })}
            </div>
          </section>

          <section className="mt-16">
            <div className="rounded-3xl border border-[#e6d4be] bg-white/80 p-6 shadow-[0_18px_40px_rgba(75,50,20,0.12)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-[#2c1c12]">Recommended reads</h2>
                  <p className="text-sm text-[#7c6a5c]">Curated picks to get you started.</p>
                </div>
                <span className="rounded-full border border-[#e6d4be] bg-[#fff7ee] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#7a4d1f]">
                  Editor's shelf
                </span>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {recommendedReads.map((item) => (
                  <a
                    key={item.title}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-2xl border border-[#ead8c2] bg-[#fff7ee] p-4 transition hover:-translate-y-1 hover:border-[#c7a57b]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a06f3f]">
                      Recommendation
                    </p>
                    <h3 className="mt-2 font-serif text-xl text-[#2c1c12] group-hover:text-[#7a4d1f]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#6a5a4b]">{item.author}</p>
                    <p className="mt-3 text-sm text-[#5a4a3d]">{item.note}</p>
                    <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.2em] text-[#a06f3f]">
                      Read on Google Books
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {selectedBook ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#140c07]/70 px-4 py-8 backdrop-blur-sm"
          onClick={() => setSelectedBook(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-3xl rounded-3xl border border-[#e6d4be] bg-white p-6 shadow-[0_30px_80px_rgba(25,15,8,0.4)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a06f3f]">Selected</p>
                <h3 id="book-title" className="font-serif text-3xl text-[#1f140c]">
                  {selectedBook.volumeInfo?.title || 'Untitled'}
                </h3>
                <p className="text-sm text-[#6a5a4b]">
                  {selectedBook.volumeInfo?.authors?.join(', ') || 'Unknown Author'}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-[#e6d4be] px-4 py-2 text-sm font-semibold text-[#6a4a2a] transition hover:border-[#b07b42] hover:text-[#2c1c12]"
                onClick={() => setSelectedBook(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr]">
              <div className="h-64 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#f3d6b4] via-[#e8c09a] to-[#c8925e]">
                {selectedBook.volumeInfo?.imageLinks?.thumbnail ? (
                  <img
                    src={selectedBook.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')}
                    alt={selectedBook.volumeInfo?.title || 'Book cover'}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="space-y-4 text-sm text-[#4d3c2f]">
                <p className="text-base leading-relaxed text-[#4d3c2f]">
                  {selectedBook.volumeInfo?.description || 'No description available.'}
                </p>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#ead8c2] bg-[#fff7ee] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#a06f3f]">Published</p>
                    <p className="font-semibold text-[#2c1c12]">
                      {selectedBook.volumeInfo?.publishedDate || 'Unknown date'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#ead8c2] bg-[#fff7ee] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#a06f3f]">Length</p>
                    <p className="font-semibold text-[#2c1c12]">
                      {selectedBook.volumeInfo?.pageCount
                        ? `${selectedBook.volumeInfo.pageCount} pages`
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
                {selectedBook.volumeInfo?.previewLink ? (
                  <a
                    href={selectedBook.volumeInfo.previewLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#7a4d1f] underline decoration-[#d1a26c] decoration-2 underline-offset-4"
                  >
                    Preview on Google Books
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default App


// https://www.googleapis.com/books/v1/volumes?q=search+terms