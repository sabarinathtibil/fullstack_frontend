import type { FormEvent } from 'react'

interface SearchFormProps {
  value: string
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  onClear: () => void
}

function SearchForm({ value, isLoading, onChange, onSubmit, onClear }: SearchFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(value.trim())
  }

  return (
    <form
      className="search-form"
      role="search"
      onSubmit={handleSubmit}
      aria-label="Search product catalog"
    >
      <label className="search-label" htmlFor="product-search">
        Search the catalog
      </label>
      <div className="search-control">
        <span className="search-prefix" aria-hidden="true">
          FIND /
        </span>
        <input
          id="product-search"
          name="search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Try ‘beauty’ or ‘furniture’"
          autoComplete="off"
          maxLength={100}
        />
        {value && (
          <button className="clear-search" type="button" onClick={onClear}>
            Clear
          </button>
        )}
        <button className="search-submit" type="submit" disabled={isLoading}>
          {isLoading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  )
}

export default SearchForm
