class ListingController < ApplicationController
  def index
    @listing = Listing.limit(100)
  end

  def show
    @listing = Listing.find(params[:id])
  end
end
