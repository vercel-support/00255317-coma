
import { TCashReconsiliation } from '@/schemas';
import { StoreApi, create } from 'zustand';

interface CashReconsiliationState {
    cashReconsiliation: TCashReconsiliation | null; // Detalles completos de la reconciliación de caja
}

// Definir el tipo de la función para establecer el estado
interface CashReconsiliationActions {
    setCashReconsiliation: (reconsiliation: TCashReconsiliation) => void;
}

// Combinar los tipos de estado y acciones en un solo tipo
type CashReconsiliationStore = CashReconsiliationState & CashReconsiliationActions;

// Crear el store para manejar el estado global
const useCashReconsiliationStore = create<CashReconsiliationStore>((set: StoreApi<CashReconsiliationStore>['setState']) => ({
    cashReconsiliation: null,

    // Función para establecer todos los detalles de la reconciliación de caja
    setCashReconsiliation: (reconsiliation: TCashReconsiliation) =>
        set(() => ({
            cashReconsiliation: reconsiliation,
        })),
}));

export default useCashReconsiliationStore;
