class AddActiveDateToListings < ActiveRecord::Migration[7.0]
  def change
    add_column :listings, :active_date, :datetime
  end
end
