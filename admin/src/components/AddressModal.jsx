import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import toast from "react-hot-toast";
import Input, { Label } from "./ui/input";
import {
  MdClose,
  MdLocationOn,
  MdAdd,
  MdEdit,
  MdDelete,
  MdStar,
  MdStarBorder,
} from "react-icons/md";
import PropTypes from "prop-types";
import axios from "axios";
import { serverUrl } from "../../config";

const AddressModal = ({ isOpen, close, userId, token, onAddressesChange }) => {
  const [addresses, setAddresses] = useState([]);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${serverUrl}/api/user/${userId}/addresses`,
        { headers: { token } }
      );

      if (response.data.success) {
        setAddresses(response.data.addresses || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Fetch addresses error", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch addresses"
      );
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  // Fetch addresses when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchAddresses();
    }
  }, [isOpen, userId, fetchAddresses]);

  const resetAddressForm = () => {
    setAddressForm({
      label: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: "",
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const openAddressForm = (address = null) => {
    if (address) {
      setAddressForm({ ...address });
      setEditingAddress(address);
    } else {
      resetAddressForm();
    }
    setIsAddressFormOpen(true);
  };

  const closeAddressForm = () => {
    setIsAddressFormOpen(false);
    resetAddressForm();
  };

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (
      !addressForm.label ||
      !addressForm.street ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.zipCode ||
      !addressForm.country
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      let response;

      if (editingAddress) {
        // Update existing address
        response = await axios.put(
          `${serverUrl}/api/user/${userId}/addresses/${editingAddress._id}`,
          addressForm,
          { headers: { token } }
        );
      } else {
        // Add new address
        response = await axios.post(
          `${serverUrl}/api/user/${userId}/addresses`,
          addressForm,
          { headers: { token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAddresses();
        closeAddressForm();
        if (onAddressesChange) onAddressesChange();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Save address error", error);
      toast.error(error?.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `${serverUrl}/api/user/${userId}/addresses/${addressId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAddresses();
        if (onAddressesChange) onAddressesChange();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Delete address error", error);
      toast.error(error?.response?.data?.message || "Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${serverUrl}/api/user/${userId}/addresses/${addressId}/default`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAddresses();
        if (onAddressesChange) onAddressesChange();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Set default address error", error);
      toast.error(
        error?.response?.data?.message || "Failed to set default address"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-[10001] focus:outline-none"
      onClose={close}
    >
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-[10002] w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4 lg:p-6">
          <DialogPanel
            transition
            className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl 
                     rounded-xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 
                     bg-white shadow-2xl border border-gray-200 text-black 
                     max-h-[95vh] sm:max-h-[90vh] overflow-y-auto
                     transform transition-all duration-300 ease-out
                     data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <DialogTitle
                as="h3"
                className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 pr-2 flex items-center gap-2"
              >
                <MdLocationOn className="text-blue-600" />
                Manage Addresses
              </DialogTitle>
              <button
                onClick={close}
                className="self-end sm:self-auto text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                         transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Close modal"
              >
                <MdClose className="text-xl sm:text-2xl" />
              </button>
            </div>

            {/* Address List */}
            <div className="space-y-4">
              {/* Add New Address Button */}
              <div className="flex justify-between items-center">
                <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                  Saved Addresses ({addresses.length})
                </h4>
                <button
                  onClick={() => openAddressForm()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition-colors text-sm font-medium"
                  disabled={loading}
                >
                  <MdAdd className="text-lg" />
                  Add New
                </button>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading...</span>
                </div>
              )}

              {/* Addresses Grid */}
              {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <MdLocationOn className="mx-auto text-4xl mb-2 text-gray-300" />
                      <p>No addresses found. Add your first address!</p>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`relative border rounded-lg p-4 transition-all duration-200 ${
                          address.isDefault
                            ? "border-blue-300 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        {/* Default Badge */}
                        {address.isDefault && (
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                              <MdStar className="text-sm" />
                              Default
                            </span>
                          </div>
                        )}

                        {/* Address Content */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-gray-900">
                              {address.label}
                            </h5>
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{address.street}</p>
                            <p>
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p>{address.country}</p>
                            {address.phone && <p>📞 {address.phone}</p>}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-2">
                            {!address.isDefault && (
                              <button
                                onClick={() =>
                                  handleSetDefaultAddress(address._id)
                                }
                                className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 
                                         hover:bg-blue-50 rounded transition-colors"
                                disabled={loading}
                                title="Set as default"
                              >
                                <MdStarBorder className="text-sm" />
                                Set Default
                              </button>
                            )}

                            <button
                              onClick={() => openAddressForm(address)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 
                                       hover:bg-gray-50 rounded transition-colors"
                              disabled={loading}
                              title="Edit address"
                            >
                              <MdEdit className="text-sm" />
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 
                                       hover:bg-red-50 rounded transition-colors"
                              disabled={loading}
                              title="Delete address"
                            >
                              <MdDelete className="text-sm" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={close}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg 
                         hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 transition-all duration-200 
                         font-medium text-sm"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>

      {/* Address Form Modal */}
      <Dialog
        open={isAddressFormOpen}
        as="div"
        className="relative z-[10003] focus:outline-none"
        onClose={closeAddressForm}
      >
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="fixed inset-0 z-[10004] w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <DialogPanel
              className="w-full max-w-xs sm:max-w-md md:max-w-lg 
                       rounded-xl px-4 py-4 sm:px-6 sm:py-6 
                       bg-white shadow-2xl border border-gray-200 text-black 
                       max-h-[95vh] overflow-y-auto
                       transform transition-all duration-300 ease-out
                       data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <div className="flex items-center justify-between mb-4">
                <DialogTitle className="text-lg font-bold text-gray-900">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </DialogTitle>
                <button
                  onClick={closeAddressForm}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <Label htmlFor="label">Address Label *</Label>
                  <Input
                    id="label"
                    name="label"
                    value={addressForm.label}
                    onChange={handleAddressFormChange}
                    placeholder="e.g., Home, Work, Billing"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressFormChange}
                    placeholder="Enter street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressFormChange}
                      placeholder="Enter state"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={addressForm.zipCode}
                      onChange={handleAddressFormChange}
                      placeholder="Enter ZIP code"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressFormChange}
                      placeholder="Enter country"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={addressForm.phone}
                    onChange={handleAddressFormChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressFormChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isDefault" className="cursor-pointer">
                    Set as default address
                  </Label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeAddressForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                             hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg 
                             hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Saving..." : editingAddress ? "Update" : "Add"}{" "}
                    Address
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Dialog>
  );
};

AddressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  userId: PropTypes.string,
  token: PropTypes.string.isRequired,
  onAddressesChange: PropTypes.func,
};

export default AddressModal;
