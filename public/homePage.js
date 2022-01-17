"use strics";

// выход из личного кабинета
let logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        } else {
            console.error(response.error);
        }
    });
};
//получение информации о пользователе
ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    } else {
        console.error(response.error);
    }
});
// курсы валют
let ratesBoard = new RatesBoard();

function getCurrency() {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        } else {
            console.log(response.error);
        }
    });
};
getCurrency();
setInterval(getCurrency, 60000);
// операции с деньгами
let moneyManager = new MoneyManager();

// пополнение баланса
moneyManager.addMoneyCallback = (data) => { 
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Пополнение баланса прошло успешно");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    })
};
// конвертирование валюты
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Конвертация прошла успешно");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}
//перевод валют
moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Перевод прошел успешно");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

//Работа с избранным
let favoritesWidget = new FavoritesWidget();
//начальный список избранного
ApiConnector.getFavorites((response) => {
    if (response.success) {
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
        if (response.success) {
           favoritesWidget.clearTable();
           favoritesWidget.fillTable(response.data);
           moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь добавлен в список избранных");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
};
// удаление пользователя из избранного
favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
           favoritesWidget.clearTable();
           favoritesWidget.fillTable(response.data);
           moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь успешно удален");
        } else {
             favoritesWidget.setMessage(false, response.error);
        }
    });
};