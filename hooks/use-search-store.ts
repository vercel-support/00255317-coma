import { create } from 'zustand';

interface SearchState {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategoryId: string | null; // Cambiar el nombre a selectedCategoryId
    setSelectedCategoryId: (categoryId: string | null) => void; // Cambiar el nombre a setSelectedCategoryId
    resetSearch: () => void;
}

const useSearchStore = create<SearchState>((set) => ({
    searchTerm: '',
    setSearchTerm: (term: string) => set({ searchTerm: term }),
    selectedCategoryId: null,
    setSelectedCategoryId: (categoryId: string | null) => set({ selectedCategoryId: categoryId, searchTerm: '' }), // Resetear también searchTerm
    resetSearch: () => set({ searchTerm: '', selectedCategoryId: null }),
}));

export default useSearchStore;
