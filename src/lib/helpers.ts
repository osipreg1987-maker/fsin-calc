// @ts-nocheck
import { SPLIT_DATE } from './constants';

export const getRoundedMonths = (start, end) => {
            let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            let days = end.getDate() - start.getDate() + 1;
            
            if (days < 0) {
                months -= 1;
                const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
                days += prevMonthDays;
            }
            
            if (days >= 15) {
                months += 1;
            }
            return Math.max(0, months);
        };

export const formatCurrency = (val) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 2 }).format(val);
};

export const getItemCategory = (name) => {

            const n = name.toLowerCase();
            if (n.includes('шапка') || n.includes('фуражка') || n.includes('пилотка') || n.includes('берет') || n.includes('шляпа')) return 'Головные уборы';
            if (n.includes('пальто') || n.includes('плащ') || n.includes('куртка') || (n.includes('костюм') && n.includes('зимний'))) return 'Верхняя одежда';
            if (n.includes('китель') || n.includes('жакет') || n.includes('брюки') || n.includes('юбка') || n.includes('платье') || (n.includes('костюм') && n.includes('летн'))) return 'Форменная одежда';
            if (n.includes('рубашка') || n.includes('блузка')) return 'Рубашки и блузки';
            if (n.includes('ботинки') || n.includes('полуботинки') || n.includes('сапоги') || n.includes('туфли') || n.includes('берцами')) return 'Обувь';
            if (n.includes('белье') || n.includes('свитер') || n.includes('носки') || n.includes('колготки')) return 'Белье и чулочно-носочные изделия';
            if (n.includes('воротник') || n.includes('галстук') || n.includes('закрепка') || n.includes('заколка') || n.includes('кашне') || n.includes('перчатки') || n.includes('ремень')) return 'Аксессуары и фурнитура';
            return 'Прочее';
        };

