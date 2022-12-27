package model

import (
	"brain/database"
	"errors"
	"log"
	sharedtypes "sharedTypes"

	"github.com/google/uuid"
)

// Trade asset needs to check the user has enough of that asset first.
func StartTradeAsset(tradeType string, price float64, amount float64, userId uuid.UUID, assetId uuid.UUID) (sharedtypes.Transaction, error) {
	var transaction sharedtypes.Transaction

	if tradeType != "buy" && tradeType != "sell" {
		return transaction, errors.New("Invalid trade type")
	}

	// If user is looking to buy, they need to have enough money
	if tradeType == "buy" {
		user := sharedtypes.User{
			Base: sharedtypes.Base{
				ID: userId,
			},
		}

		database.Db.First(&user)
		// Will need to LOCK the users balance.
		// TODO: Add new database table for locked funds.
		if user.Balance < price {
			return transaction, errors.New("User does not have enough funds")
		}

		transaction.AssetId = assetId.String()
		transaction.State = "in-market"
		transaction.Price = price
		transaction.Amount = amount
    transaction.BuyerId = userId.String()
    database.Db.Omit("seller_id, balance").Create(&transaction)
	} else {
		// Selling the asset, we must check the user has enough of this asset.
		// TODO: Add a LOCKED asset table
    userAsset := sharedtypes.UserAsset {
      UserId: userId.String(),
      AssetId: assetId.String(),
    }

    database.Db.First(&userAsset)

		if userAsset.Amount < amount {
			log.Println("The user does not have enough of this asset.")
			return transaction, errors.New("The user does not have enough of this asset.")
		}

		transaction.AssetId = assetId.String()
		transaction.State = "in-market"
		transaction.Price = price
		transaction.Amount = amount
    transaction.SellerId = userId.String()
    database.Db.Omit("buyer_id, balance").Create(&transaction)
	}

	return transaction, nil
}

/*
// Used to take an in market transaction and completeing it.
// Because on the make transaction we locked the users assets and money to make the transaction.
// We can go ahead and proceed without many checks needed.
func CompleteTradeAsset(transactionId uuid.UUID, userId uuid.UUID) (sharedtypes.Transaction, error) {
	transaction := sharedtypes.Transaction{
		Base: sharedtypes.Base{
			ID: transactionId,
		},
	}

  user := sharedtypes.User {
    Base: sharedtypes.Base {
      ID: userId,
    },
  }

  database.Db.First(&user)
	res := database.Db.First(&transaction)

	if res.RowsAffected == 0 {
		return transaction, errors.New("This transaction could not be found")
	}

	// This means that the transaction is of someone selling the asset.
  // So our user is looking to buy.
	// Therefore, we need to check the user has enough money to complete.
	if transaction.BuyerId == "" {
    // Deduce money, add user assets to the buyer.
    // Do the reverse for seller.
    seller := sharedtypes.User {
      Base: sharedtypes.Base {
        ID: uuid.MustParse(transaction.SellerId),
      },
    }

    var oldUserAsset sharedtypes.UserAsset
    var newUserAsset sharedtypes.UserAsset

    // Get the user asset of the seller.
		database.Db.Table("user_assets").Select("*").Where("user_id = ? AND asset_id = ?", transaction.SellerId, transaction.AssetId).First(&oldUserAsset)

    // Get the user asset of the buyer
		database.Db.Table("user_assets").Select("*").Where("user_id = ? AND asset_id = ?", userId.String(), transaction.AssetId).First(&newUserAsset)

    user.Balance = user.Balance - transaction.Price
    seller.Balance = seller.Balance + transaction.Price
    
    oldUserAsset.Amount = oldUserAsset.Amount - transaction.Amount
    newUserAsset.Amount = newUserAsset.Amount + transaction.Amount

    transaction.State = "completed"
    transaction.BuyerId = user.ID.String()
    
    database.Db.Save(&oldUserAsset)
    database.Db.Save(&newUserAsset)
    database.Db.Save(&user)
    database.Db.Save(&seller)
    database.Db.Save(&transaction)

	} else {
    buyer := sharedtypes.User {
      Base: sharedtypes.Base {
        ID: uuid.MustParse(transaction.BuyerId),
      },
    }

    var oldUserAsset sharedtypes.UserAsset
    var newUserAsset sharedtypes.UserAsset

    // Get the user asset of the seller.
		database.Db.Table("user_assets").Select("*").Where("user_id = ? AND asset_id = ?", transaction.BuyerId, transaction.AssetId).First(&oldUserAsset)

    // Get the user asset of the buyer
		database.Db.Table("user_assets").Select("*").Where("user_id = ? AND asset_id = ?", userId.String(), transaction.AssetId).First(&newUserAsset)

    user.Balance = user.Balance + transaction.Price
    buyer.Balance = buyer.Balance - transaction.Price
    
    oldUserAsset.Amount = oldUserAsset.Amount + transaction.Amount
    newUserAsset.Amount = newUserAsset.Amount - transaction.Amount

    transaction.State = "completed"
    transaction.SellerId = user.ID.String()
    
    database.Db.Omit("name").Save(&oldUserAsset)
    database.Db.Omit("name").Save(&newUserAsset)
    database.Db.Save(&user)
    database.Db.Save(&buyer)
    database.Db.Omit("balance").Save(&transaction)

  }

  return transaction, nil
}
*/

func GetAllTransactions() []sharedtypes.Transaction {
  var transactions []sharedtypes.Transaction
  database.Db.Find(&transactions)
  return transactions
}
