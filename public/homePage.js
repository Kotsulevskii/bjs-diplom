"use strics";

// выход из личного кабинета
let logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success === true) {
            location.reload();
        } else {
            console.error(response.error);
        }
    });
};
//получение информации о пользователе
ApiConnector.current((response) => {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data);
    } else {
        console.error(response.error);
    }
});
// курсы валют
let ratesBoard = new RatesBoard();

function getCurrency() {
    ApiConnector.getStocks((response) => {
        if (response.success === true) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        } else {
            console.log(response.error);
        }
    });
};
getCurrency();

// операции с деньгами
let moneyManager = new MoneyManager();

// пополнение баланса
moneyManager.addMoneyCallback = (data) => { 
    ApiConnector.addMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Пополнение баланса прошло успешно");
        } else {
            moneyManager.setMessage(false, "Пополнение баланса не выполнено");
        }
    })
};
// конвертирование валюты
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Конвертация прошла успешно");
        } else {
            moneyManager.setMessage(false, "Конвертация не выполнена");
        }
    });
}
//перевод валют
moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Перевод прошел успешно");
        } else {
            moneyManager.setMessage(false, "Перевод не выполнен");
        }
    });
}

//Работа с избранным
let favoritesWidget = new FavoritesWidget();
//начальный список избранного
ApiConnector.getFavorites((response) => {
    if (response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    } else {
        console.error(response.error);
    }
});
//добавления пользователя в список избранных
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success === true) {
           favoritesWidget.clearTable();
           favoritesWidget.fillTable(response.data);
           moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, "Пользователь добавлен в список избранных");
        } else {
            moneyManager.setMessage(false, "Не удалось добавить пользователя в список избранных");
        }
    });
};
// удаление пользователя из избранного
favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success === true) {
           favoritesWidget.clearTable();
           favoritesWidget.fillTable(response.data);
           moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, "Пользователь успешно удален");
        } else {
            moneyManager.setMessage(false, "Не удалось удалить пользователя");
        }
    });
};