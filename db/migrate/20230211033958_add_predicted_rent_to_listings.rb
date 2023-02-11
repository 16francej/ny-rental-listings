class AddPredictedRentToListings < ActiveRecord::Migration[7.0]
  def change
    add_column :listings, :predicted_rent, :decimal
  end
end
