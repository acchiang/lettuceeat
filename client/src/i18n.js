import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const I18N_LANGUAGE = "I18N_LANGUAGE";

i18n.use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "light":"light",
                    "dark":"dark",
                    "front-page":"Take me to the front page",
                    "user-icons":"User icons",
                    "buttons":"Buttons",
                    "small":"small",
                    "medium":"medium",
                    "large":"large",
                    "primary":"primary",
                    "secondary":"secondary",
                    "text":"text",
                    "others":"others",
                    "default":"default",
                    "click-me":"click me!",
                    "button-clicked":"button clicked",
                    "disabled":"disabled",
                    "user-inputs":"User inputs",
                    "side-by-side":"side-by-side",
                    "username":"username",
                    "dollar-amt-component": "Dollar Amount Component",
                    "subtotal":"Subtotal",
                    "total-amt-component": "Total Amount Component",
                    "dropdown":"dropdown",
                    "other":"other",
                    "back-button":"Back button",
                    "title": "LettuceEat",
                    "tagline": "Easy ordering and bill splitting",
                    "toggle-lang": "French",
                    "toggle-theme": "Toggle theme",
                    "event-name": "Event Name*",
                    "event-name-placeholder": "Dine Out (required)",
                    "users-name": "Your Name*",
                    "users-name-placeholder": "John Doe (required)",
                    "password": "Password",
                    "optional": "optional",
                    "menu": "Menu",
                    "create": "Create",
                    "tip":"Tip",
                    "order-total":"Order total",
                    "confirm-order":"Confirm order",
                    "users":"Users",
                    "group-total":"Group Total So Far",
                    "consolidate":"Consolidate",
                    "refresh":"Refresh",
                    "required-alert":"Please fill in the required fields.",
                    "password-alert":"Password must be at between 6 to 30 characters.",
                    "final-order-summary":"Final Order Summary",
                    "edit-order":"Edit order",
                    "menu-total":"Menu Total",
                    "tip-total":"Tip Total",
                    "final-total":"Final Total",
                    "link-alert":"Link copied to clipboard",
                    "link-failed-alert":"Link did not copy to clipboard",
                    "user-failed-alert":"Unable to create user or username is taken",
                    "join":"Join",
                    "join-session":"Joining session...",
                    "email":"Email*",
                    "login":"Login"
                }
            },
            fr: {
                translation: {
                    "light":"clair",
                    "dark":"sombre",
                    "front-page":"Emmenez-moi à la première page",
                    "user-icons":"Icônes utilisateur",
                    "buttons":"Boutons",
                    "small":"petite",
                    "medium":"moyenne",
                    "large":"grande",
                    "primary":"primaire",
                    "secondary":"secondaire",
                    "text":"texte",
                    "others":"les autres",
                    "default":"défaut",
                    "click-me":"cliquez moi!",
                    "button-clicked":"bouton cliqué",
                    "disabled":"désactivé",
                    "user-inputs":"Entrées utilisateur",
                    "side-by-side":"cote à cote",
                    "username":"nom d'utilisateur",
                    "dollar-amt-component": "Composante montant en dollars",
                    "subtotal":"Total",
                    "total-amt-component": "Composant montant total",
                    "dropdown":"Menu déroulant",
                    "other":"autre",
                    "back-button":"Bouton retour",
                    "title": "LettuceEat en français",
                    "tagline": "Commande et fractionnement de facture faciles",
                    "toggle-lang": "Anglaise",
                    "toggle-theme": "Basculer le thème",
                    "event-name": "Nom de l'événement*",
                    "event-name-placeholder": "Dîner (obligatoire)",
                    "users-name": "Votre nom*",
                    "users-name-placeholder": "Jean Dupont (obligatoire)",
                    "password": "Le mot de passe",
                    "optional": "optionnel",
                    "menu": "Menu",
                    "create": "Créer",
                    "tip":"Pourboire",
                    "order-total":"Total de la commande",
                    "confirm-order":"Confirmer la commande",
                    "users":"Utilisateurs",
                    "group-total":"Total du groupe à ce jour",
                    "consolidate":"Consolider",
                    "refresh":"Rafraîchir",
                    "required-alert":"S'il vous plaît remplir les champs obligatoires.",
                    "password-alert":"Le mot de passe doit comporter entre 6 et 30 caractères.",
                    "final-order-summary":"Résumé de la Commande Finale",
                    "edit-order":"Modifier la commande",
                    "menu-total":"Total du Menu",
                    "tip-total":"Pourboire Total",
                    "final-total":"Fin Totale",
                    "link-alert":"Lien copié dans le presse-papiers",
                    "link-failed-alert":"Link did not copy to clipboard",
                    "user-failed-alert":"Le lien n'a pas été copié dans le presse-papiers",
                    "join":"Rejoindre",
                    "join-session":"Rejoindre la session...",
                    "email":"Courrier électronique*",
                    "login":"Connexion"
                }
            }
        },
        lng: localStorage.getItem(I18N_LANGUAGE) || "en",
        fallbackLng: 'en',
        debug: true,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });


export default i18n;