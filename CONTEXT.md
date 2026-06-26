# Domain Context

This context covers the public presentation of original paintings and the inquiries visitors send about them.

## Language

**Engela Art**:
The artist's public brand name used consistently across the website, business profile, social channels, and customer-facing documents.
_Avoid_: Engela-art, EngelaArt

**Painting**:
An original artwork presented in the portfolio, whether available, reserved, or sold.
_Avoid_: Product, inventory item

**Painting title**:
The artist-given official name of a painting, preserved unchanged across languages. An English explanation may appear in descriptive copy but is not a second title.
_Avoid_: Translated title, localized title

**Painting ID**:
An immutable public reference in the form `EA-YYYY-NNN` that identifies one painting across the website, inquiries, invoices, condition records, and private operations register.
_Avoid_: Slug, invoice number

**Painting inquiry**:
A formal message from a visitor about a specific painting, carrying that painting as its reference. The website form is the preferred submission channel, but direct email remains valid.
_Avoid_: Order, purchase

**Interested buyer**:
A person who has submitted or directly sent a painting inquiry but has not received a confirmed reservation.
_Avoid_: Confirmed buyer, customer

**Similar-work inquiry**:
A painting inquiry that uses a sold painting as a reference to express interest in related future work. It does not itself constitute a commission request or commitment to reproduce the painting.
_Avoid_: Purchase inquiry, commission

**Commission inquiry**:
A request to discuss a new painting inspired by the artist's existing body of work. It does not create an accepted commission, guarantee an exact copy, or require the artist to work in an unrelated style.
_Avoid_: Commission, custom order, reproduction

**Commission proposal**:
The artist's written offer describing the agreed creative direction, dimensions, medium, price, timeline, feedback process, delivery, and payment terms for a potential commission.
_Avoid_: Inquiry response, accepted commission

**Interest list**:
The submission-ordered list of visitors who inquired about a reserved painting. Joining the list does not reserve the painting or guarantee that it will become available.
_Avoid_: Reservation, guaranteed waiting list

**Reservation**:
A temporary priority granted by the artist to a buyer after direct human confirmation. An inquiry alone never creates a reservation.
_Avoid_: Inquiry, interest-list entry

**Sold painting**:
A painting for which Engela Art has received full payment. Accepted terms, an issued invoice, or a partial payment alone do not make a painting sold.
_Avoid_: Reserved painting, invoiced painting

Public painting status uses only `available`, `reserved`, and `sold`. Refunds, disputes, shipping, and returns are operational events rather than additional portfolio statuses.

**Invoice**:
The formal payment request sent after the artist confirms the painting, buyer, delivery arrangement, and reservation. It presents bank transfer, Vipps Business, and PayPal Business as payment alternatives.
_Avoid_: Checkout, order confirmation

**Listed price**:
The public NOK amount shown for a painting and retained as historical pricing context after sale. It is distinct from any confidential negotiated transaction total.
_Avoid_: Sale price, invoice total

**Medium**:
The bilingual description of the painting's physical materials and support, such as acrylic, pastel, texture paste, or canvas.
_Avoid_: Technique, care profile

**Technique**:
The bilingual description of how the artist made the painting, such as brushwork, layering, palette-knife work, pouring, glazing, or other process and mark-making choices.
_Avoid_: Medium, care profile

**Care profile**:
The approved set of handling and display guidance applicable to a painting's materials and surface. It is selected explicitly rather than inferred from descriptive medium text.
_Avoid_: Medium, generated care advice

**Certificate of authenticity**:
The signed physical and matching digital record that identifies an original painting through its immutable painting ID and artist details.
_Avoid_: Receipt, invoice

**Orientation**:
The shape of a painting derived from its width and height: landscape, portrait, or square.
_Avoid_: Layout, format
