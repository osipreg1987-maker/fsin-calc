// @ts-nocheck
export const SPLIT_DATE = new Date(2021, 1, 25); // 25.02.2021


        export const NORMS_M = [
            { id: 1, name: 'Норма № 1 (Генералы)' },
            { id: 21, name: 'Норма № 2 (Полковники)' },
            { id: 2, name: 'Норма № 2 (От мл. лейтенанта до подполковника)' },
            { id: 3, name: 'Норма № 3 (Младший начсостав)' }
        ];

        export const NORMS_F = [
            { id: 1, name: 'Норма № 1 (Генералы - женщины)' },
            { id: 21, name: 'Норма № 2 (Полковники - женщины)' },
            { id: 2, name: 'Норма № 2 (Офицеры до подполковника)' },
            { id: 4, name: 'Норма № 4 (Младший начсостав - женщины)' }
        ];

        export const ITEMS = [
            // --- МУЖЧИНЫ ---
            { id: 'm_shapka_karakul', name: 'Шапка-ушанка меховая из каракуля (полковники)', gender: 'M', norms: [21], wear_789: 48, wear_150: 48, price: 3017 },
            { id: 'm_shapka_gen', name: 'Шапка из каракуля с козырьком', gender: 'M', norms: [1], wear_789: 60, wear_150: 48, price: 12500 },
            { id: 'm_shapka_ovchina', name: 'Шапка-ушанка меховая из овчины', gender: 'M', norms: [2, 3], wear_789: 36, wear_150: 36, price: 695 },
            { id: 'm_furazhka_gen', name: 'Фуражка (высший начсостав)', gender: 'M', norms: [1], wear_789: 36, wear_150: 36, price: 11264 },
            { id: 'm_furazhka', name: 'Фуражка', gender: 'M', norms: [21, 2, 3], wear_789: 48, wear_150: 48, price: 551 },
            { id: 'm_furazhka_parad', name: 'Фуражка парадная', gender: 'M', norms: [1], wear_789: 60, wear_150: 60, price: 13772 },
            { id: 'm_furazhka_let', name: 'Фуражка летняя', gender: 'M', norms: [1, 21, 2, 3], wear_789: 24, wear_150: 18, wear_789_norm3: 12, wear_150_norm3: 12, price: 160 },
            { id: 'm_pilotka_beret', name: 'Пилотка (берет)', gender: 'M', norms: [1, 21, 2, 3], wear_789: 48, wear_150: 48, price: 168 },
            { id: 'm_vorotnik', name: 'Воротник съемный из каракуля', gender: 'M', norms: [1], wear_789: 60, wear_150: 60, price: 3500 },
            { id: 'm_plash_kozha', name: 'Плащ демисезонный кожаный', gender: 'M', norms: [1], wear_789: 60, wear_150: 60, price: 14000 },
            { id: 'm_kurtka_kozha', name: 'Куртка утепленная кожаная', gender: 'M', norms: [1, 21], wear_789: 60, wear_150: 60, price: 45000 },
            { id: 'm_palto', name: 'Пальто шерстяное зимнее', gender: 'M', norms: [1], wear_789: 60, wear_150: 60, price: 14200 },
            { id: 'm_kurtka_zim', name: 'Куртка зимняя', gender: 'M', norms: [21, 2, 3], wear_789: null, wear_150: 60, wear_150_norm3: 72, price: 2435 },
            { id: 'm_kurtka_demi', name: 'Куртка демисезонная', gender: 'M', norms: [21, 2, 3], wear_789: 60, wear_150: 60, wear_789_norm3: 72, price: 1955 },
            { id: 'm_kostum_zim', name: 'Костюм (куртка и брюки) зимний', gender: 'M', norms: [1, 21, 2, 3], wear_789: 36, wear_150: 36, price: 2787 },
            { id: 'm_kostum_let', name: 'Костюм (куртка и брюки) летний', gender: 'M', norms: [1, 21, 2, 3], wear_789: 24, wear_150: 18, wear_789_norm3: 12, wear_150_norm3: 12, price: 1040 },
            { id: 'm_plash_nakidka', name: 'Плащ-накидка', gender: 'M', norms: [1, 21, 2, 3], wear_789: 120, wear_150: 120, price: 1320 },
            { id: 'm_kitel_gen', name: 'Китель (высший начсостав)', gender: 'M', norms: [1], wear_789: 36, wear_150: 36, price: 28000 },
            { id: 'm_kitel', name: 'Китель', gender: 'M', norms: [21, 2, 3], wear_789: 36, wear_150: 36, price: 1642 },
            { id: 'm_kitel_parad', name: 'Китель парадный', gender: 'M', norms: [1], wear_789: 60, wear_150: 60, price: 32080 },
            { id: 'm_kitel_vihod', name: 'Китель выходной', gender: 'M', norms: [21, 2], wear_789: null, wear_150: 60, price: 1642 },
            { id: 'm_bruki_gen', name: 'Брюки (высший начсостав)', gender: 'M', norms: [1], wear_789: 12, wear_150: 12, price: 2880 },
            { id: 'm_bruki', name: 'Брюки', gender: 'M', norms: [21, 2, 3], wear_789: 12, wear_150: 12, wear_789_norm3: 18, wear_150_norm3: 18, price: 872 },
            { id: 'm_kurtka', name: 'Куртка', gender: 'M', norms: [1, 21, 2, 3], wear_789: 36, wear_150: 36, price: 1335 },
            { id: 'm_rubashka', name: 'Рубашка', gender: 'M', norms: [1, 21, 2, 3], wear_789: 6, wear_150: 6, price: 457 },
            { id: 'm_galstuk', name: 'Галстук', gender: 'M', norms: [1, 21, 2, 3], wear_789: 6, wear_150: 6, price: 60 },
            { id: 'm_zakrepka', name: 'Закрепка для галстука', gender: 'M', norms: [1, 21, 2, 3], wear_789: 120, wear_150: 120, price: 24 },
            { id: 'm_kashne', name: 'Кашне', gender: 'M', norms: [1, 21, 2, 3], wear_789: 30, wear_150: 30, price: 59 },
            { id: 'm_perchatki', name: 'Перчатки', gender: 'M', norms: [1, 21, 2, 3], wear_789: 36, wear_150: 36, price: 54 },
            { id: 'm_belie_natelnoe', name: 'Белье нательное', gender: 'M', norms: [1, 21, 2, 3], wear_789: 12, wear_150: 6, price: 272 },
            { id: 'm_belie_zimnee', name: 'Белье зимнее', gender: 'M', norms: [1, 21, 2, 3], wear_789: 12, wear_150: 24, price: 329 },
            { id: 'm_sviter', name: 'Свитер (джемпер)', gender: 'M', norms: [1, 21, 2, 3], wear_789: 60, wear_150: 36, price: 842 },
            { id: 'm_noski_hb', name: 'Носки хлопчатобумажные', gender: 'M', norms: [1, 21, 2, 3], wear_789: 6, wear_150: 6, wear_150_norm3: 3, wear_789_norm3: 3, price: 25 },
            { id: 'm_noski_psh', name: 'Носки полушерстяные', gender: 'M', norms: [1, 21, 2, 3], wear_789: 12, wear_150: 12, wear_150_norm3: 6, wear_789_norm3: 6, price: 37 },
            { id: 'm_polubotinki', name: 'Полуботинки (туфли)', gender: 'M', norms: [1, 21, 2, 3], wear_789: 12, wear_150: 12, wear_789_norm3: 18, wear_150_norm3: 18, price: 1247 },
            { id: 'm_bercy', name: 'Ботинки с высокими берцами', gender: 'M', norms: [1, 21, 2, 3], wear_789: 24, wear_150: 24, wear_789_norm1: 36, wear_150_norm1: 36, wear_789_norm21: 36, wear_150_norm21: 36, wear_789_norm3: 12, price: 1076 },
            { id: 'm_bercy_light', name: 'Ботинки с высокими берцами облегченные', gender: 'M', norms: [3], wear_789: null, wear_150: 24, price: 904 },
            { id: 'm_polusapogi', name: 'Полусапоги зимние или демисезонные', gender: 'M', norms: [1, 21, 2, 3], wear_789: 36, wear_150: 36, price: 1272 },
            { id: 'm_remen_poasnoy', name: 'Ремень поясной', gender: 'M', norms: [1, 21, 2, 3], wear_789: 120, wear_150: 120, price: 405 },
            { id: 'm_remen_bruchnoy', name: 'Ремень брючный', gender: 'M', norms: [1, 21, 2, 3], wear_789: 60, wear_150: 60, price: 144 },

            // --- ЖЕНЩИНЫ ---
            { id: 'f_shapka_karakul', name: 'Шапка-ушанка меховая из каракуля', gender: 'F', norms: [1, 21], wear_789: 48, wear_150: 48, price: 3017 },
            { id: 'f_shapka_gen', name: 'Шапка из каракуля (генеральская)', gender: 'F', norms: [1], wear_789: 60, wear_150: 48, price: 11000 },
            { id: 'f_shapka_ovchina', name: 'Шапка-ушанка меховая из овчины', gender: 'F', norms: [2, 4], wear_789: 36, wear_150: 36, price: 695 },
            { id: 'f_furazhka_let', name: 'Фуражка летняя', gender: 'F', norms: [1, 21, 2, 4], wear_789: 18, wear_150: 18, wear_789_norm4: 12, wear_150_norm4: 12, price: 160 },
            { id: 'f_shlyapa', name: 'Шляпа фетровая', gender: 'F', norms: [1], wear_789: 36, wear_150: 36, price: 5366 },
            { id: 'f_pilotka', name: 'Пилотка', gender: 'F', norms: [1, 21, 2, 4], wear_789: 36, wear_150: 36, price: 168 },
            { id: 'f_beret', name: 'Берет', gender: 'F', norms: [1, 21, 2, 4], wear_789: 48, wear_150: 48, price: 170 },
            { id: 'f_vorotnik', name: 'Воротник съемный из каракуля', gender: 'F', norms: [1], wear_789: 60, wear_150: 60, price: 3500 },
            { id: 'f_kostum_zim', name: 'Костюм (куртка и брюки) зимний', gender: 'F', norms: [1, 21, 2, 4], wear_789: 36, wear_150: 36, price: 2787 },
            { id: 'f_kostum_let', name: 'Костюм (куртка и брюки) летний', gender: 'F', norms: [1, 21, 2, 4], wear_789: 24, wear_150: 18, wear_789_norm4: 12, wear_150_norm4: 12, price: 1040 },
            { id: 'f_plash_kozha', name: 'Плащ демисезонный кожаный', gender: 'F', norms: [1], wear_789: 60, wear_150: 60, price: 14000 },
            { id: 'f_kurtka_zim', name: 'Куртка зимняя', gender: 'F', norms: [21, 2, 4], wear_789: null, wear_150: 60, price: 2297 },
            { id: 'f_kurtka_kozha', name: 'Куртка утепленная кожаная', gender: 'F', norms: [1, 21], wear_789: 60, wear_150: 60, price: 42000 },
            { id: 'f_kurtka_demi', name: 'Куртка демисезонная', gender: 'F', norms: [21, 2, 4], wear_789: 60, wear_150: 60, price: 1789 },
            { id: 'f_palto', name: 'Пальто шерстяное', gender: 'F', norms: [1], wear_789: 60, wear_150: 60, price: 14200 },
            { id: 'f_plash_nakidka', name: 'Плащ-накидка', gender: 'F', norms: [1, 21, 2, 4], wear_789: 120, wear_150: 120, price: 1320 },
            { id: 'f_zhaket_gen', name: 'Жакет (высший начсостав)', gender: 'F', norms: [1], wear_789: 36, wear_150: 36, price: 17067 },
            { id: 'f_zhaket', name: 'Жакет', gender: 'F', norms: [21, 2, 4], wear_789: 18, wear_150: 36, wear_789_norm4: 24, price: 1269 },
            { id: 'f_zhaket_vihod', name: 'Жакет выходной', gender: 'F', norms: [21, 2], wear_789: null, wear_150: 60, price: 1269 },
            { id: 'f_zhaket_parad', name: 'Жакет парадный', gender: 'F', norms: [1], wear_789: 60, wear_150: 60, price: 18133 },
            { id: 'f_yubka', name: 'Юбка', gender: 'F', norms: [1, 21, 2, 4], wear_789: 18, wear_150: 18, price: 445 },
            { id: 'f_kurtka', name: 'Куртка', gender: 'F', norms: [1, 21, 2, 4], wear_789: 36, wear_150: 36, price: 1109 },
            { id: 'f_bruki', name: 'Брюки', gender: 'F', norms: [1, 21, 2, 4], wear_789: 36, wear_150: 36, wear_789_norm4: 42, wear_150_norm4: 42, price: 809 },
            { id: 'f_plate', name: 'Платье летнее', gender: 'F', norms: [1, 21, 2, 4], wear_789: null, wear_150: 36, price: 816 },
            { id: 'f_bluzka', name: 'Блузка', gender: 'F', norms: [1, 21, 2, 4], wear_789: 6, wear_150: 6, price: 388 },
            { id: 'f_galstuk_bant', name: 'Галстук-бант', gender: 'F', norms: [1, 21, 2, 4], wear_789: 6, wear_150: 6, price: 41 },
            { id: 'f_zakolka', name: 'Заколка для галстука-банта', gender: 'F', norms: [1, 21, 2, 4], wear_789: 120, wear_150: 120, price: 24 },
            { id: 'f_kashne', name: 'Кашне', gender: 'F', norms: [1, 21, 2, 4], wear_789: 30, wear_150: 30, price: 59 },
            { id: 'f_perchatki', name: 'Перчатки', gender: 'F', norms: [1, 21, 2, 4], wear_789: 36, wear_150: 36, price: 54 },
            { id: 'f_belie_natelnoe', name: 'Белье нательное', gender: 'F', norms: [1, 21, 2, 4], wear_789: 12, wear_150: 6, price: 272 },
            { id: 'f_belie_zimnee', name: 'Белье зимнее', gender: 'F', norms: [1, 21, 2, 4], wear_789: 24, wear_150: 24, price: 329 },
            { id: 'f_sviter', name: 'Свитер (джемпер)', gender: 'F', norms: [1, 21, 2, 4], wear_789: 60, wear_150: 36, price: 760 },
            { id: 'f_noski_hb', name: 'Носки х/б (колготки)', gender: 'F', norms: [1, 21, 2, 4], wear_789: 6, wear_150: 6, wear_789_norm4: 3, wear_150_norm4: 3, price: 25 },
            { id: 'f_noski_psh', name: 'Носки п/ш (колготки)', gender: 'F', norms: [1, 21, 2, 4], wear_789: 12, wear_150: 12, wear_789_norm4: 6, wear_150_norm4: 6, price: 37 },
            { id: 'f_sapogi', name: 'Сапоги зимние или демисезонные', gender: 'F', norms: [1, 21, 2, 4], wear_789: 36, wear_150: 36, price: 1330 },
            { id: 'f_tufli', name: 'Туфли', gender: 'F', norms: [1, 21, 2, 4], wear_789: 24, wear_150: 24, price: 674 },
            { id: 'f_bercy', name: 'Ботинки с высокими берцами', gender: 'F', norms: [1, 21, 2, 4], wear_789: 24, wear_150: 24, wear_789_norm1: 36, wear_150_norm1: 36, wear_789_norm21: 36, wear_150_norm21: 36, price: 1072 },
            { id: 'f_bercy_light', name: 'Ботинки с высокими берцами облегченные', gender: 'F', norms: [4], wear_789: null, wear_150: 24, price: 904 },
            { id: 'f_remen_poasnoy', name: 'Ремень поясной', gender: 'F', norms: [1, 21, 2, 4], wear_789: 120, wear_150: 120, price: 405 }
        ];



        export function parseDate(dateStr) {
            if (!dateStr) return null;
            if (dateStr.includes('-')) {
                const [y, m, d] = dateStr.split('-');
                return new Date(y, m - 1, d);
            }
            if (dateStr.includes('.')) {
                const [d, m, y] = dateStr.split('.');
                if (y && y.length === 4) return new Date(y, m - 1, d);
            }
            return null;
        }
