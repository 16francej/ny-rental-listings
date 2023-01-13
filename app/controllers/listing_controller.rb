class ListingController < ApplicationController
  def index
    @listing = Listing.all
  end
end
