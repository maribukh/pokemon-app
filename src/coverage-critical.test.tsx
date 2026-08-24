import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

const mockReplace = vi.fn();
const mockRedirect = vi.fn();
const fetchPokemonByNameMock = vi.fn();

const messages = {
  header: { home: 'Home', about: 'About' },
  search: { placeholder: 'Search Pokémon', button: 'Search' },
  pagination: {
    prev: 'Previous',
    next: 'Next',
    page: 'Page {current} of {total}',
  },
  flyout: {
    item: '{count} item',
    items: '{count} items',
    unselectAll: 'Unselect all',
    download: 'Download CSV',
  },
};

function MockLink({
  children,
  href,
  className,
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => {
    return (key: string, values?: Record<string, string | number>) => {
      let value = messages[namespace]?.[key] ?? key;
      if (values) {
        for (const [replaceKey, replaceValue] of Object.entries(values)) {
          value = value.replace(`{${replaceKey}}`, String(replaceValue));
        }
      }
      return value;
    };
  },
  useLocale: () => 'en',
}));

vi.mock('next-intl/server', () => ({
  getRequestConfig: (config: unknown) => config,
  getTranslations: async (namespace: string) => {
    return (key: string, values?: Record<string, string | number>) => {
      let value = messages[namespace]?.[key] ?? key;
      if (values) {
        for (const [replaceKey, replaceValue] of Object.entries(values)) {
          value = value.replace(`{${replaceKey}}`, String(replaceValue));
        }
      }
      return value;
    };
  },
  getLocale: async () => 'en',
}));

vi.mock('next-intl/middleware', () => ({
  default: vi.fn(() => ({})),
}));

vi.mock('next-intl/navigation', () => ({
  createNavigation: () => ({
    Link: MockLink,
    redirect: mockRedirect,
    usePathname: () => '/',
    useRouter: () => ({ replace: mockReplace }),
  }),
}));

vi.mock('./i18n/navigation', () => ({
  Link: MockLink,
  redirect: mockRedirect,
  usePathname: () => '/',
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('./services/pokemonApi', () => ({
  fetchPokemonByName: fetchPokemonByNameMock,
}));

vi.mock('./components/ExplainPokemonButton/ExplainPokemonButton', () => ({
  default: ({ context }: { context?: { id?: number } }) => (
    <div>Explain {context?.id ?? 'pokemon'}</div>
  ),
}));

const Header = (await import('./components/Header/Header')).default;
const Pagination = (await import('./components/Pagination/Pagination')).default;
const SearchForm = (await import('./components/SearchForm/SearchForm')).default;
const { searchAction } = await import('./components/SearchForm/actions');
const Flyout = (await import('./components/Flyout/Flyout')).default;
const DetailsImage = (await import('./components/DetailsPanel/DetailsImage'))
  .default;
const DetailsStats = (await import('./components/DetailsPanel/DetailsStats'))
  .default;
const DetailsTypes = (await import('./components/DetailsPanel/DetailsTypes'))
  .default;
const DetailsPanel = (await import('./components/DetailsPanel/DetailsPanel'))
  .default;
const ThemeToggle = (await import('./components/ThemeToggle/ThemeToggle'))
  .default;
const { ThemeProvider } = await import('./context/ThemeContext');
const { useSelectedItemsStore } = await import('./store/selectedItemsStore');
const { mapPokemonToCard } = await import('./utils/pokemonMapper');
const { getPokemonImage, getStatValue } = await import('./utils/pokemonStats');
const { routing } = await import('./i18n/routing');
const middlewareModule = await import('./middleware');
const { default: middleware, config: middlewareConfig } = middlewareModule;
const requestConfig = (await import('./i18n/request')).default;

function makePokemon() {
  return {
    id: 25,
    name: 'pikachu',
    height: 40,
    weight: 60,
    types: [{ slot: 1, type: { name: 'electric', url: 'electric' } }],
    stats: [
      { base_stat: 35, effort: 0, stat: { name: 'hp', url: 'hp' } },
      { base_stat: 55, effort: 0, stat: { name: 'attack', url: 'attack' } },
    ],
    sprites: {
      front_default: '/front.png',
      other: { 'official-artwork': { front_default: '/official.png' } },
    },
  };
}

describe('coverage gaps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSelectedItemsStore.setState({ selectedItems: {} });
  });

  it('renders the header and switches locale', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );

    await user.selectOptions(screen.getByLabelText('Language'), 'ru');
    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'ru' });
  });

  it('renders pagination controls and the null state', async () => {
    const page = await Pagination({
      currentPage: 2,
      totalPages: 3,
      search: 'pikachu',
    });
    render(<>{page}</>);

    expect(screen.getByText('Previous')).toHaveAttribute(
      'href',
      '/?page=1&search=pikachu'
    );
    expect(screen.getByText('Next')).toHaveAttribute(
      'href',
      '/?page=3&search=pikachu'
    );
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();

    const singlePage = await Pagination({
      currentPage: 1,
      totalPages: 1,
      search: '',
    });
    expect(singlePage).toBeNull();
  });

  it('renders the search form and redirects with properly bound action', async () => {
    const form = await SearchForm({ initialTerm: 'pikachu' });
    render(<>{form}</>);

    expect(screen.getByPlaceholderText('Search Pokémon')).toHaveValue(
      'pikachu'
    );

    const formData = new FormData();
    formData.set('search', 'charizard');
    await searchAction('en', formData);
    expect(mockRedirect).toHaveBeenCalledWith({
      href: '/?page=1&search=charizard',
      locale: 'en',
    });
  });

  it('renders the theme toggle with pressed state updates', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle theme' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders details subcomponents and the panel', async () => {
    render(<DetailsImage src="/bulba.png" alt="Bulbasaur" />);
    expect(screen.getByRole('img', { name: 'Bulbasaur' })).toBeInTheDocument();

    render(<DetailsStats height={17} weight={60} hp={35} attack={55} />);
    expect(screen.getByText('Height: 1.7 m')).toBeInTheDocument();
    expect(screen.getByText('Weight: 6.0 kg')).toBeInTheDocument();
    expect(screen.getByText('HP: 35')).toBeInTheDocument();
    expect(screen.getByText('Attack: 55')).toBeInTheDocument();

    render(
      <DetailsTypes
        types={[
          { slot: 1, type: { name: 'grass', url: 'grass' } },
          { slot: 2, type: { name: 'poison', url: 'poison' } },
        ]}
      />
    );
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();

    fetchPokemonByNameMock.mockResolvedValue(makePokemon());
    const panel = await DetailsPanel({
      id: 'pikachu',
      page: 2,
      search: 'bulba',
    });
    render(<>{panel}</>);
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  it('updates the selected item store and renders the flyout', async () => {
    const user = userEvent.setup();
    const item = {
      id: 1,
      name: 'bulbasaur',
      types: ['grass'],
      imageUrl: '/bulba.png',
    };

    useSelectedItemsStore.getState().toggleItem(item);
    expect(
      Object.keys(useSelectedItemsStore.getState().selectedItems)
    ).toHaveLength(1);

    useSelectedItemsStore.getState().toggleItem(item);
    expect(
      Object.keys(useSelectedItemsStore.getState().selectedItems)
    ).toHaveLength(0);

    useSelectedItemsStore.setState({ selectedItems: { 1: item } });
    render(<Flyout />);
    expect(screen.getByText('1 item')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unselect all' }));
    expect(useSelectedItemsStore.getState().selectedItems).toEqual({});
  });

  it('maps pokemon metadata and utility functions', () => {
    const pokemon = makePokemon();
    const mapped = mapPokemonToCard(pokemon);

    expect(mapped).toMatchObject({
      id: 25,
      name: 'pikachu',
      types: ['electric'],
      imageUrl: '/official.png',
      height: 40,
      weight: 60,
      hp: 35,
      attack: 55,
    });

    expect(getPokemonImage(pokemon)).toBe('/official.png');
    expect(
      getPokemonImage({
        ...pokemon,
        sprites: { front_default: '/fallback.png', other: {} },
      })
    ).toBe('/fallback.png');
    expect(getStatValue(pokemon, 'hp')).toBe(35);
    expect(getStatValue(pokemon, 'speed')).toBeUndefined();
  });

  it('covers the routing and middleware defaults', async () => {
    expect(routing.locales).toEqual(['en', 'ru']);
    expect(routing.defaultLocale).toBe('en');
    expect(middleware).toBeDefined();
    expect(middlewareConfig.matcher).toEqual(['/((?!api|_next|.*\\..*).*)']);

    const config = await requestConfig({
      requestLocale: Promise.resolve('ru'),
    });
    expect(config.locale).toBe('ru');
    expect(config.messages).toBeDefined();

    const fallback = await requestConfig({
      requestLocale: Promise.resolve('fr'),
    });
    expect(fallback.locale).toBe('en');
  });

  it('runs the empty search redirect', async () => {
    const formData = new FormData();
    await searchAction('en', formData);
    expect(mockRedirect).toHaveBeenCalledWith({
      href: '/?page=1',
      locale: 'en',
    });
  });
});
