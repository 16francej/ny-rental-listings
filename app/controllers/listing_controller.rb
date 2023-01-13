class ListingController < ApplicationController
  def index
    @listing = Listing.all
  end

  def show
    @listing = Listing.find(params[:id])
  end
end
