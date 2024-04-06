#! /usr/bin/env python3

from .account_service import account, delete_account, logout, edit_account, upload_profile_picture, load_profile_picture, complete_registration, save_preferences
from .auth_service import register, verify, login, login_verify
from .budget_service import update_budget, update_user_deduction, get_deductions, get_past_budgets, reset_weekly_budgets
from .friend_service import send_friend_request, list_friends, received_friend_requests, sent_friend_requests, respond_friend_request, cancel_friend_request, remove_friend, search_users, view_friend_profile, friend_activity_dashboard
from .fuel_station_service import get_favorite_fuel_stations, get_past_petrol_prices, get_fuel_stations, store_fuel_stations, favorite_fuel_station, store_fuel_prices, store_ev_prices, search_fuel_stations, add_rating_to_fuel_station
from .ocr_service import upload_receipt, save_receipt
from .trip_service import save_trip
from .user_admin_support_service import view_all_users, update_role, remove_role, send_support_ticket, view_support_tickets, reply_to_ticket, close_support_ticket, mark_ticket_as_solved
from .vehicle_service import create_user_vehicle, get_user_vehicle, update_user_vehicle, delete_user_vehicle, get_vehicle_makes, get_vehicle_models_for_makes, get_vehicle_years_for_model

__all__ = [account, delete_account, logout, edit_account, upload_profile_picture, load_profile_picture, complete_registration, save_preferences, register, verify, login, login_verify, update_budget, update_user_deduction, get_deductions, get_past_budgets, reset_weekly_budgets, send_friend_request, list_friends, received_friend_requests, sent_friend_requests, respond_friend_request, cancel_friend_request, remove_friend, search_users, view_friend_profile, friend_activity_dashboard, get_favorite_fuel_stations,
           get_past_petrol_prices, get_fuel_stations, store_fuel_stations, favorite_fuel_station, store_fuel_prices, store_ev_prices, search_fuel_stations, add_rating_to_fuel_station, upload_receipt, save_receipt, save_trip, view_all_users, update_role, remove_role, send_support_ticket, view_support_tickets, reply_to_ticket, close_support_ticket, mark_ticket_as_solved, create_user_vehicle, get_user_vehicle, update_user_vehicle, delete_user_vehicle, get_vehicle_makes, get_vehicle_models_for_makes, get_vehicle_years_for_model]
