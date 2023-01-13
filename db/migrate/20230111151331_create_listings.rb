class CreateListings < ActiveRecord::Migration[7.0]
  def up
    create_table :listings, id: false, primary_key: :id do |t|
      t.text :id
      t.text :name
      t.text :address
      t.decimal :monthly_rental_price
      t.decimal :num_bedrooms
      t.decimal :num_bathrooms
      t.text :neighborhood
      t.text :url

      t.timestamps

      t.index :id, unique: true
    end
  end

  def down
    drop_table :listings
  end
end
