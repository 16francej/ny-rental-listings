class ListingController < ApplicationController
  def index
    @listing = Listing
                  .where.not(predicted_rent: nil)
                  .order(Arel.sql("(predicted_rent - monthly_rental_price) DESC"))
                  .limit(200)
    @listing = @listing.map do |listing|
      listing.neighborhood = listing.neighborhood.gsub(%q{\'}, '')
      listing
    end
  end

  def show
    @listing = Listing.find(params[:id])
  end
end
